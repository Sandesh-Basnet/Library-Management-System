'use strict';

const { query } = require('../config/db');

const GENRE_COLUMNS = `
  g.id,
  g.name,
  g.description,
  g.shelf_location AS shelfLocation,
  (SELECT COUNT(*) FROM books b WHERE b.genre_id = g.id) AS bookCount
`;

async function getAll() {
  return query(`SELECT ${GENRE_COLUMNS} FROM genres g ORDER BY g.name ASC`);
}

async function getById(id) {
  const rows = await query(`SELECT ${GENRE_COLUMNS} FROM genres g WHERE g.id = ?`, [id]);
  return rows[0] || null;
}

/** Lightweight list for reference dropdowns: [{ id, name }] */
async function getOptions() {
  return query('SELECT id, name FROM genres ORDER BY name ASC');
}

async function nameExists(name, excludeId = null) {
  const params = [name];
  let sql = 'SELECT id FROM genres WHERE name = ?';
  if (excludeId) {
    sql += ' AND id <> ?';
    params.push(excludeId);
  }
  const rows = await query(sql, params);
  return rows.length > 0;
}

async function create(genre) {
  const result = await query(
    'INSERT INTO genres (name, description, shelf_location) VALUES (?, ?, ?)',
    [genre.name, genre.description || null, genre.shelfLocation || null],
  );
  return getById(result.insertId);
}

async function update(id, genre) {
  await query(
    'UPDATE genres SET name = ?, description = ?, shelf_location = ? WHERE id = ?',
    [genre.name, genre.description || null, genre.shelfLocation || null, id],
  );
  return getById(id);
}

async function remove(id) {
  await query('DELETE FROM genres WHERE id = ?', [id]);
}

module.exports = { getAll, getById, getOptions, nameExists, create, update, remove };
