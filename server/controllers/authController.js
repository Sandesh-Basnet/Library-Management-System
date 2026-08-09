'use strict';

const bcrypt = require('bcryptjs');
const adminModel = require('../models/adminModel');
const { validateLogin } = require('../validators/authValidator');

function publicUser(admin) {
  return { id: admin.id, name: admin.name, username: admin.username };
}

/** POST /api/auth/login { identity, cypher } */
async function login(req, res) {
  const { errors, value } = await validateLogin(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const admin = await adminModel.findByUsername(value.identity);
  if (!admin) {
    return res.status(401).json({ error: 'Invalid identity or cypher' });
  }

  const cypherMatches = await bcrypt.compare(value.cypher, admin.passwordHash);
  if (!cypherMatches) {
    return res.status(401).json({ error: 'Invalid identity or cypher' });
  }

  req.session.user = publicUser(admin);
  res.json({ user: publicUser(admin) });
}

/** POST /api/auth/logout */
function logout(req, res) {
  req.session.destroy(() => res.json({ success: true }));
}

/** GET /api/auth/me */
function me(req, res) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: req.session.user });
}

module.exports = { login, logout, me };
