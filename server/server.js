'use strict';

const path = require('path');
const express = require('express');
const session = require('express-session');

const config = require('./config/env');
const { notFoundApi, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const genreRoutes = require('./routes/genreRoutes');

const app = express();

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: 'pustakalaya.sid',
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.nodeEnv === 'production',
      maxAge: config.session.maxAgeMs,
    },
  }),
);

// ── REST API ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/genres', genreRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'pustakalaya' }));

// Unknown /api/* paths -> JSON 404.
app.use('/api', notFoundApi);

// ── Static frontend (client/) ───────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// ── Central error handler ───────────────────────────────────────────────────
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`पुस्तकालय server listening on http://localhost:${config.port}`);
  console.log(`  API:   http://localhost:${config.port}/api`);
  console.log(`  Client: http://localhost:${config.port}/`);
});
