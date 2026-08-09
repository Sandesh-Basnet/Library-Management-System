'use strict';

const mysql = require('mysql2/promise');
const config = require('./env');

const pool = mysql.createPool(config.db);

/**
 * Run a raw query against the connection pool.
 * Promises are resolved with an array of rows; query() returns rows directly.
 */
async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

/** Escape a single value into a SQL literal (used by the seed script). */
function escape(value) {
  return pool.escape(value);
}

module.exports = { pool, query, escape };
