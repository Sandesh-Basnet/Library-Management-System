'use strict';

const { isEmpty, isString, maxLen, applyInput } = require('./helpers');

async function validateAuthor(input, context = {}) {
  const errors = [];
  const body = applyInput(input, { trim: ['name', 'bio', 'specialty'] });

  if (isEmpty(body.name)) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (!isString(body.name)) {
    errors.push({ field: 'name', message: 'Name must be text' });
  } else if (!maxLen(body.name, 255)) {
    errors.push({ field: 'name', message: 'Name must be 255 characters or fewer' });
  }

  if (!isEmpty(body.bio) && !maxLen(body.bio, 10000)) {
    errors.push({ field: 'bio', message: 'Bio must be 10,000 characters or fewer' });
  }

  if (!isEmpty(body.specialty) && !maxLen(body.specialty, 255)) {
    errors.push({ field: 'specialty', message: 'Specialty must be 255 characters or fewer' });
  }

  if (context.model && body.name && (await context.model.nameExists(body.name, context.editingId || null))) {
    errors.push({ field: 'name', message: 'An author with this name is already registered' });
  }

  return errors.length ? { errors, value: null } : { errors, value: body };
}

module.exports = { validateAuthor };
