'use strict';

const { query } = require('../config/db');

/** Column aliases shared by every SELECT that returns book rows. */
const BOOK_COLUMNS = `
  b.id,
  b.title,
  b.author_id AS authorId,
  a.name AS author,
  b.genre_id AS genreId,
  g.name AS genre,
  b.isbn,
  b.archive_ref AS archiveRef,
  b.description,
  b.cover_image_url AS coverImageUrl,
  b.published_year AS publishedYear,
  b.total_copies AS totalCopies,
  b.available_copies AS availableCopies,
  b.condition_level AS conditionLevel,
  b.restoration_log AS restorationLog,
  b.low_stock_threshold AS lowStockThreshold,
  (b.available_copies <= b.low_stock_threshold) AS isLowStock
`;

const BOOK_FROM = `
  FROM books b
  JOIN authors a ON a.id = b.author_id
  JOIN genres g ON g.id = b.genre_id
`;

/** Convert raw rows so isLowStock is a real boolean, not MySQL tinyint. */
function shapeBook(row) {
  return { ...row, isLowStock: Boolean(row.isLowStock) };
}

/**
 * List books, optionally filtered.
 * @param {Object} [filters]
 * @param {string} [filters.search] matches title, author name, genre name,
 *   isbn, or archive reference.
 * @param {number|string} [filters.genreId]
 * @param {boolean} [filters.lowStock] restrict to low-stock books.
 */
async function getAll(filters = {}) {
  const conditions = [];
  const params = [];

  if (filters.search) {
    const like = `%${filters.search}%`;
    conditions.push(
      '(b.title LIKE ? OR a.name LIKE ? OR g.name LIKE ? OR b.isbn LIKE ? OR b.archive_ref LIKE ?)',
    );
    params.push(like, like, like, like, like);
  }

  if (filters.genreId) {
    conditions.push('b.genre_id = ?');
    params.push(Number(filters.genreId));
  }

  if (filters.lowStock) {
    conditions.push('b.available_copies <= b.low_stock_threshold');
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const rows = await query(
    `SELECT ${BOOK_COLUMNS} ${BOOK_FROM} ${where} ORDER BY b.title ASC`,
    params,
  );
  return rows.map(shapeBook);
}

async function getById(id) {
  const rows = await query(
    `SELECT ${BOOK_COLUMNS} ${BOOK_FROM} WHERE b.id = ?`,
    [id],
  );
  const row = rows[0];
  return row ? shapeBook(row) : null;
}

/** Return the number of books a given author has written. */
async function countByAuthorId(authorId) {
  const rows = await query('SELECT COUNT(*) AS count FROM books WHERE author_id = ?', [authorId]);
  return rows[0].count;
}

/** Return the number of books a given genre contains. */
async function countByGenreId(genreId) {
  const rows = await query('SELECT COUNT(*) AS count FROM books WHERE genre_id = ?', [genreId]);
  return rows[0].count;
}

/** Return true when the referenced author exists. */
async function authorExists(authorId) {
  const rows = await query('SELECT 1 FROM authors WHERE id = ?', [authorId]);
  return rows.length > 0;
}

/** Return true when the referenced genre exists. */
async function genreExists(genreId) {
  const rows = await query('SELECT 1 FROM genres WHERE id = ?', [genreId]);
  return rows.length > 0;
}

/** Return true when the ISBN is already used by another book. */
async function isbnExists(isbn, excludeId = null) {
  const params = [isbn];
  let sql = 'SELECT id FROM books WHERE isbn = ?';
  if (excludeId) {
    sql += ' AND id <> ?';
    params.push(excludeId);
  }
  const rows = await query(sql, params);
  return rows.length > 0;
}

async function create(book) {
  const result = await query(
    `INSERT INTO books
      (title, author_id, genre_id, isbn, archive_ref, description,
       cover_image_url, published_year, total_copies, available_copies,
       condition_level, restoration_log, low_stock_threshold)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      book.title,
      book.authorId,
      book.genreId,
      book.isbn || null,
      book.archiveRef || null,
      book.description || null,
      book.coverImageUrl || null,
      book.publishedYear || null,
      book.totalCopies,
      book.availableCopies,
      book.conditionLevel || null,
      book.restorationLog || null,
      book.lowStockThreshold,
    ],
  );
  return getById(result.insertId);
}

async function update(id, book) {
  await query(
    `UPDATE books SET
       title = ?, author_id = ?, genre_id = ?, isbn = ?, archive_ref = ?,
       description = ?, cover_image_url = ?, published_year = ?,
       total_copies = ?, available_copies = ?, condition_level = ?,
       restoration_log = ?, low_stock_threshold = ?
     WHERE id = ?`,
    [
      book.title,
      book.authorId,
      book.genreId,
      book.isbn || null,
      book.archiveRef || null,
      book.description || null,
      book.coverImageUrl || null,
      book.publishedYear || null,
      book.totalCopies,
      book.availableCopies,
      book.conditionLevel || null,
      book.restorationLog || null,
      book.lowStockThreshold,
      id,
    ],
  );
  return getById(id);
}

async function remove(id) {
  await query('DELETE FROM books WHERE id = ?', [id]);
}

/** Dashboard / alert endpoints. */
async function getLowStock() {
  return getAll({ lowStock: true });
}

async function getStats() {
  const rows = await query(
    `SELECT
       (SELECT COUNT(*) FROM books) AS totalBooks,
       (SELECT COALESCE(SUM(total_copies), 0) FROM books) AS cumulativeCopies,
       (SELECT COUNT(*) FROM books WHERE available_copies <= low_stock_threshold) AS lowStockCount,
       (SELECT COUNT(*) FROM authors) AS totalAuthors,
       (SELECT COUNT(*) FROM genres) AS totalGenres`,
  );
  return rows[0];
}

/** Books in the same genre, excluding the given book, for the "Similar Works" strip. */
async function getRelated(book, limit = 3) {
  const rows = await query(
    `SELECT ${BOOK_COLUMNS} ${BOOK_FROM}
     WHERE b.genre_id = ? AND b.id <> ?
     ORDER BY b.title ASC
     LIMIT ?`,
    [book.genreId, book.id, Number(limit)],
  );
  return rows.map(shapeBook);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  countByAuthorId,
  countByGenreId,
  authorExists,
  genreExists,
  isbnExists,
  getLowStock,
  getStats,
  getRelated,
};
