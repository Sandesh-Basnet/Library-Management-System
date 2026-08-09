'use strict';

const { isEmpty, applyInput } = require('./helpers');

/**
 * Login payload uses the frontend's thematic field names:
 * `identity` (archivist email or registry id) and `cypher` (password).
 */
async function validateLogin(input) {
  const errors = [];
  const body = applyInput(input, { trim: ['identity', 'cypher'] });

  if (isEmpty(body.identity)) {
    errors.push({ field: 'identity', message: 'Archivist identity is required' });
  }

  if (isEmpty(body.cypher)) {
    errors.push({ field: 'cypher', message: 'Secret cypher is required' });
  }

  return errors.length ? { errors, value: null } : { errors, value: body };
}

module.exports = { validateLogin };
