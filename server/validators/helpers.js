'use strict';

/** Shared helpers for manual (dependency-free) server-side validation. */

function isEmpty(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

function isString(value) {
  return typeof value === 'string';
}

function maxLen(value, max) {
  return String(value).length <= max;
}

function isIntInRange(value, { min = null, max = null } = {}) {
  if (value === '' || value === undefined || value === null) return false;
  const n = Number(value);
  if (!Number.isInteger(n)) return false;
  if (min !== null && n < min) return false;
  if (max !== null && n > max) return false;
  return true;
}

/**
 * Accepts ISBN-10 or ISBN-13. Dashes/spaces are stripped before checking so
 * both "978-0123456789" and "9780123456789" pass.
 */
function isValidIsbn(value) {
  const clean = String(value).replace(/[-\s]/g, '');
  if (/^\d{13}$/.test(clean)) return true;
  if (/^\d{9}[\dXx]$/.test(clean)) return true;
  return false;
}

/** Must be an absolute http(s) URL (book covers are referenced, not uploaded). */
function isValidUrl(value) {
  if (isEmpty(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

/**
 * Persist resolved (trimmed / coerced) values back onto the input object so
 * controllers never write raw client input. Keys listed in `fields` are
 * trimmed when strings; integer fields are coerced to Number.
 */
function applyInput(input, { trim = [], ints = [] }) {
  const body = { ...input };
  for (const key of trim) {
    if (body[key] !== undefined && body[key] !== null && typeof body[key] === 'string') {
      body[key] = body[key].trim();
    }
  }
  for (const key of ints) {
    if (body[key] !== undefined && body[key] !== null && body[key] !== '') {
      body[key] = Number(body[key]);
    }
  }
  return body;
}

module.exports = {
  isEmpty,
  isString,
  maxLen,
  isIntInRange,
  isValidIsbn,
  isValidUrl,
  isValidEmail,
  applyInput,
};
