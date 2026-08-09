'use strict';

const genreModel = require('../models/genreModel');
const bookModel = require('../models/bookModel');
const { validateGenre } = require('../validators/genreValidator');

function toId(value) {
  return Number.parseInt(value, 10);
}

/** GET /api/genres */
async function list(req, res) {
  const data = await genreModel.getAll();
  res.json({ data, total: data.length });
}

/** GET /api/genres/options — lightweight {id, name} list for dropdowns */
async function options(req, res) {
  res.json({ data: await genreModel.getOptions() });
}

/** GET /api/genres/:id */
async function show(req, res) {
  const genre = await genreModel.getById(toId(req.params.id));
  if (!genre) return res.status(404).json({ error: 'Genre not found' });
  res.json(genre);
}

/** POST /api/genres */
async function create(req, res) {
  const { errors, value } = await validateGenre(req.body, { model: genreModel });
  if (errors.length) return res.status(400).json({ errors });
  const genre = await genreModel.create(value);
  res.status(201).json(genre);
}

/** PUT /api/genres/:id */
async function update(req, res) {
  const id = toId(req.params.id);
  const existing = await genreModel.getById(id);
  if (!existing) return res.status(404).json({ error: 'Genre not found' });

  const { errors, value } = await validateGenre(req.body, { model: genreModel, editingId: id });
  if (errors.length) return res.status(400).json({ errors });

  const genre = await genreModel.update(id, value);
  res.json(genre);
}

/** DELETE /api/genres/:id */
async function remove(req, res) {
  const id = toId(req.params.id);
  const existing = await genreModel.getById(id);
  if (!existing) return res.status(404).json({ error: 'Genre not found' });

  const bookCount = await bookModel.countByGenreId(id);
  if (bookCount > 0) {
    return res.status(400).json({
      errors: [{
        field: 'genre',
        message: `Cannot delete a genre containing ${bookCount} book${bookCount === 1 ? '' : 's'}. Reassign or remove those books first.`,
      }],
    });
  }

  await genreModel.remove(id);
  res.json({ success: true });
}

module.exports = { list, options, show, create, update, remove };
