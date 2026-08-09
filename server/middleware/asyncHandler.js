'use strict';

/**
 * Wraps an async route handler so rejected promises flow to the central
 * error handler instead of crashing Express (Express 4 does not catch async
 * errors by itself).
 */
function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = { asyncHandler };
