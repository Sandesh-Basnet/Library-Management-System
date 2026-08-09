'use strict';

const { isEmpty, isString, maxLen, applyInput } = require('./helpers');

async function validateGenre(input, context = {}) {
  const errors = [];
  const body = applyInput(input, { trim: ['name', 'description', 'shelfLocation'] });

  if (isEmpty(body.name)) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (!isString(body.name)) {
    errors.push({ field: 'name', message: 'Name must be text' });
  } else if (!maxLen(body.name, 255)) {
    errors.push({ field: 'name', message: 'Name must be 255 characters or fewer' });
  }

  if (!isEmpty(body.description) && !maxLen(body.description, 10000)) {
    errors.push({ field: 'description', message: 'Description must be 10,000 characters or fewer' });
  }

  if (!isEmpty(body.shelfLocation) && !maxLen(body.shelfLocation, 255)) {
    errors.push({ field: 'shelfLocation', message: 'Shelf location must be 255 characters or fewer' });
  }

  if (context.model && body.name && (await context.model.nameExists(body.name, context.editingId || null))) {
    errors.push({ field: 'name', message: 'A genre with this name is already defined' });
  }

  return errors.length ? { errors, value: null } : { errors, value: body };
}

module.exports = { validateGenre };
