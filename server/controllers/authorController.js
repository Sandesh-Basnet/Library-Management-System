'use strict';

const authorModel = require('../models/authorModel');
const bookModel = require('../models/bookModel');
const { validateAuthor } = require('../validators/authorValidator');

function toId(value) {
  return Number.parseInt(value, 10);
}

/** GET /api/authors */
async function list(req, res) {
  const data = await authorModel.getAll();
  res.json({ data, total: data.length });
}

/** GET /api/authors/options — lightweight {id, name} list for dropdowns */
async function options(req, res) {
  res.json({ data: await authorModel.getOptions() });
}

/** GET /api/authors/:id */
async function show(req, res) {
  const author = await authorModel.getById(toId(req.params.id));
  if (!author) return res.status(404).json({ error: 'Author not found' });
  res.json(author);
}

/** POST /api/authors */
async function create(req, res) {
  const { errors, value } = await validateAuthor(req.body, { model: authorModel });
  if (errors.length) return res.status(400).json({ errors });
  const author = await authorModel.create(value);
  res.status(201).json(author);
}

/** PUT /api/authors/:id */
async function update(req, res) {
  const id = toId(req.params.id);
  const existing = await authorModel.getById(id);
  if (!existing) return res.status(404).json({ error: 'Author not found' });

  const { errors, value } = await validateAuthor(req.body, { model: authorModel, editingId: id });
  if (errors.length) return res.status(400).json({ errors });

  const author = await authorModel.update(id, value);
  res.json(author);
}

/** DELETE /api/authors/:id */
async function remove(req, res) {
  const id = toId(req.params.id);
  const existing = await authorModel.getById(id);
  if (!existing) return res.status(404).json({ error: 'Author not found' });

  const bookCount = await bookModel.countByAuthorId(id);
  if (bookCount > 0) {
    return res.status(400).json({
      errors: [{
        field: 'author',
        message: `Cannot delete an author with ${bookCount} registered book${bookCount === 1 ? '' : 's'}. Reassign or remove their books first.`,
      }],
    });
  }

  await authorModel.remove(id);
  res.json({ success: true });
}

module.exports = { list, options, show, create, update, remove };
