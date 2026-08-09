'use strict';

/** Error type carrying an HTTP status; used for controlled failures. */
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

/** 404 for unknown /api routes. */
function notFoundApi(req, res) {
  res.status(404).json({ error: 'API route not found' });
}

/** Final error handler: validation -> 400, otherwise 500 with generic body. */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message });
  }

  // MySQL duplicate key (e.g. unique ISBN / name) — surface a field error.
  if (err && err.code === 'ER_DUP_ENTRY') {
    const field = /'(isbn|name)'/i.test(err.sqlMessage) ? /'(isbn|name)'/i.exec(err.sqlMessage)[1] : 'name';
    const message = field === 'isbn'
      ? 'ISBN is already registered in the archives'
      : 'A record with this name already exists';
    return res.status(400).json({ errors: [{ field, message }] });
  }

  console.error('[errorHandler]', err);
  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = { ApiError, notFoundApi, errorHandler };
