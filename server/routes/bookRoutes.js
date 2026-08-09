'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const bookController = require('../controllers/bookController');

const router = express.Router();

// Public GETs — catalog browsing stays open.
router.get('/', asyncHandler(bookController.list));
router.get('/low-stock', asyncHandler(bookController.lowStock));
router.get('/stats', asyncHandler(bookController.stats));
router.get('/:id/related', asyncHandler(bookController.related));
router.get('/:id', asyncHandler(bookController.show));

// Write operations — admin only.
router.post('/', requireAuth, asyncHandler(bookController.create));
router.put('/:id', requireAuth, asyncHandler(bookController.update));
router.delete('/:id', requireAuth, asyncHandler(bookController.remove));

module.exports = router;
