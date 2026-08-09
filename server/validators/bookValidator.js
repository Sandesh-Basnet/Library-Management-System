'use strict';

const {
  isEmpty,
  isString,
  maxLen,
  isIntInRange,
  isValidIsbn,
  isValidUrl,
  applyInput,
} = require('./helpers');

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Validate an incoming book payload.
 * @param {Object} input raw request body
 * @param {Object} [context]
 * @param {number|null} [context.editingId] set when updating an existing book
 *   so ISBN uniqueness can be checked against other rows only.
 * @param {Object} [context.model] bookModel used for existence checks
 * @returns {Promise<{errors: Array, value: Object|null}>}
 */
async function validateBook(input, context = {}) {
  const errors = [];
  const body = applyInput(input, {
    trim: ['title', 'isbn', 'archiveRef', 'description', 'coverImageUrl', 'conditionLevel', 'restorationLog'],
    ints: ['authorId', 'genreId', 'publishedYear', 'totalCopies', 'availableCopies', 'lowStockThreshold'],
  });

  if (isEmpty(body.title)) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (!isString(body.title)) {
    errors.push({ field: 'title', message: 'Title must be text' });
  } else if (!maxLen(body.title, 255)) {
    errors.push({ field: 'title', message: 'Title must be 255 characters or fewer' });
  }

  if (!isIntInRange(body.authorId, { min: 1 })) {
    errors.push({ field: 'authorId', message: 'A valid author must be selected' });
  }

  if (!isIntInRange(body.genreId, { min: 1 })) {
    errors.push({ field: 'genreId', message: 'A valid genre must be selected' });
  }

  if (!isEmpty(body.isbn)) {
    if (!isString(body.isbn)) {
      errors.push({ field: 'isbn', message: 'ISBN must be text' });
    } else if (!isValidIsbn(body.isbn)) {
      errors.push({ field: 'isbn', message: 'ISBN must be a valid ISBN-10 or ISBN-13 (e.g. 978-0123456789)' });
    } else if (!maxLen(body.isbn, 20)) {
      errors.push({ field: 'isbn', message: 'ISBN must be 20 characters or fewer' });
    }
  }

  if (!isEmpty(body.archiveRef) && !maxLen(body.archiveRef, 50)) {
    errors.push({ field: 'archiveRef', message: 'Archive reference must be 50 characters or fewer' });
  }

  if (!isEmpty(body.description) && !maxLen(body.description, 10000)) {
    errors.push({ field: 'description', message: 'Description must be 10,000 characters or fewer' });
  }

  if (!isEmpty(body.coverImageUrl)) {
    if (!isValidUrl(body.coverImageUrl)) {
      errors.push({ field: 'coverImageUrl', message: 'Cover image must be a valid http(s) URL' });
    } else if (!maxLen(body.coverImageUrl, 500)) {
      errors.push({ field: 'coverImageUrl', message: 'Cover image URL must be 500 characters or fewer' });
    }
  }

  if (!isEmpty(body.publishedYear) && !isIntInRange(body.publishedYear, { min: 1000, max: CURRENT_YEAR + 1 })) {
    errors.push({ field: 'publishedYear', message: `Published year must be an integer between 1000 and ${CURRENT_YEAR + 1}` });
  }

  if (!isIntInRange(body.totalCopies, { min: 1 })) {
    errors.push({ field: 'totalCopies', message: 'Total copies must be a positive integer' });
  }

  if (!isIntInRange(body.availableCopies, { min: 0 })) {
    errors.push({ field: 'availableCopies', message: 'Available copies must be a non-negative integer' });
  }

  if (
    Number.isInteger(body.totalCopies) &&
    Number.isInteger(body.availableCopies) &&
    body.availableCopies > body.totalCopies
  ) {
    errors.push({ field: 'availableCopies', message: 'Available copies cannot exceed total copies' });
  }

  if (!isIntInRange(body.lowStockThreshold, { min: 0 })) {
    errors.push({ field: 'lowStockThreshold', message: 'Low-stock threshold must be a non-negative integer' });
  }

  if (!isEmpty(body.conditionLevel) && !maxLen(body.conditionLevel, 50)) {
    errors.push({ field: 'conditionLevel', message: 'Condition must be 50 characters or fewer' });
  }

  if (!isEmpty(body.restorationLog) && !maxLen(body.restorationLog, 255)) {
    errors.push({ field: 'restorationLog', message: 'Restoration log must be 255 characters or fewer' });
  }

  if (context.model) {
    if (body.authorId && !(await context.model.authorExists(body.authorId))) {
      errors.push({ field: 'authorId', message: 'The selected author does not exist' });
    }
    if (body.genreId && !(await context.model.genreExists(body.genreId))) {
      errors.push({ field: 'genreId', message: 'The selected genre does not exist' });
    }
    if (body.isbn && (await context.model.isbnExists(body.isbn, context.editingId || null))) {
      errors.push({ field: 'isbn', message: 'ISBN is already registered in the archives' });
    }
  }

  return errors.length ? { errors, value: null } : { errors, value: body };
}

module.exports = { validateBook };
