'use strict';

const { query } = require('../config/db');

const AUTHOR_COLUMNS = `
  a.id,
  a.name,
  a.bio,
  a.specialty,
  (SELECT COUNT(*) FROM books b WHERE b.author_id = a.id) AS bookCount
`;

async function getAll() {
  return query(`SELECT ${AUTHOR_COLUMNS} FROM authors a ORDER BY a.name ASC`);
}

async function getById(id) {
  const rows = await query(`SELECT ${AUTHOR_COLUMNS} FROM authors a WHERE a.id = ?`, [id]);
  return rows[0] || null;
}

/** Lightweight list for reference dropdowns: [{ id, name }] */
async function getOptions() {
  return query('SELECT id, name FROM authors ORDER BY name ASC');
}

async function nameExists(name, excludeId = null) {
  const params = [name];
  let sql = 'SELECT id FROM authors WHERE name = ?';
  if (excludeId) {
    sql += ' AND id <> ?';
    params.push(excludeId);
  }
  const rows = await query(sql, params);
  return rows.length > 0;
}

async function create(author) {
  const result = await query(
    'INSERT INTO authors (name, bio, specialty) VALUES (?, ?, ?)',
    [author.name, author.bio || null, author.specialty || null],
  );
  return getById(result.insertId);
}

async function update(id, author) {
  await query(
    'UPDATE authors SET name = ?, bio = ?, specialty = ? WHERE id = ?',
    [author.name, author.bio || null, author.specialty || null, id],
  );
  return getById(id);
}

async function remove(id) {
  await query('DELETE FROM authors WHERE id = ?', [id]);
}

module.exports = { getAll, getById, getOptions, nameExists, create, update, remove };
