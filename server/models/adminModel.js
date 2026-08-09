'use strict';

const { query } = require('../config/db');

async function findByUsername(username) {
  const rows = await query(
    'SELECT id, username, name, password_hash AS passwordHash FROM admins WHERE username = ?',
    [username],
  );
  return rows[0] || null;
}

async function getPublicById(id) {
  const rows = await query(
    'SELECT id, username, name FROM admins WHERE id = ?',
    [id],
  );
  return rows[0] || null;
}

module.exports = { findByUsername, getPublicById };
