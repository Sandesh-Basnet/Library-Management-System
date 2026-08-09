'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

function int(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: int(process.env.PORT, 3000),

  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: int(process.env.DB_PORT, 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pustakalaya',
    waitForConnections: true,
    connectionLimit: int(process.env.DB_POOL_CONNECTIONS, 10),
    queueLimit: 0,
    charset: 'utf8mb4_unicode_ci',
    decimalNumbers: true,
  },

  session: {
    secret: process.env.SESSION_SECRET || 'insecure-development-secret',
    maxAgeMs: int(process.env.SESSION_MAX_AGE_MS, 24 * 60 * 60 * 1000),
  },
};

module.exports = config;
