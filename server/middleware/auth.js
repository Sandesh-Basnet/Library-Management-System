'use strict';

/**
 * Protects write endpoints. Populated by a successful login via
 * express-session (req.session.user).
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ error: 'Not authenticated' });
}

module.exports = { requireAuth };
