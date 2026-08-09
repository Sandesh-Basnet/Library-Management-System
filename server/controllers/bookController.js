'use strict';

const bookModel = require('../models/bookModel');
const { validateBook } = require('../validators/bookValidator');

function toId(value) {
  return Number.parseInt(value, 10);
}

/** GET /api/books?search=&genreId=&lowStock= */
async function list(req, res) {
  const { search, genreId, lowStock } = req.query;
  const data = await bookModel.getAll({
    search,
    genreId,
    lowStock: lowStock === 'true',
  });
  res.json({ data, total: data.length });
}

/** GET /api/books/low-stock */
async function lowStock(req, res) {
  const data = await bookModel.getLowStock();
  res.json({ data, total: data.length });
}

/** GET /api/books/stats */
async function stats(req, res) {
  res.json(await bookModel.getStats());
}

/** GET /api/books/:id */
async function show(req, res) {
  const book = await bookModel.getById(toId(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
}

/** GET /api/books/:id/related */
async function related(req, res) {
  const book = await bookModel.getById(toId(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  const data = await bookModel.getRelated(book);
  res.json({ data, total: data.length });
}

/** POST /api/books */
async function create(req, res) {
  const { errors, value } = await validateBook(req.body, { model: bookModel });
  if (errors.length) return res.status(400).json({ errors });
  const book = await bookModel.create(value);
  res.status(201).json(book);
}

/** PUT /api/books/:id */
async function update(req, res) {
  const id = toId(req.params.id);
  const existing = await bookModel.getById(id);
  if (!existing) return res.status(404).json({ error: 'Book not found' });

  const { errors, value } = await validateBook(req.body, { model: bookModel, editingId: id });
  if (errors.length) return res.status(400).json({ errors });

  const book = await bookModel.update(id, value);
  res.json(book);
}

/** DELETE /api/books/:id */
async function remove(req, res) {
  const id = toId(req.params.id);
  const existing = await bookModel.getById(id);
  if (!existing) return res.status(404).json({ error: 'Book not found' });
  await bookModel.remove(id);
  res.json({ success: true });
}

module.exports = { list, lowStock, stats, show, related, create, update, remove };
