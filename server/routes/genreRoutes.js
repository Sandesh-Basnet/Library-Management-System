'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const genreController = require('../controllers/genreController');

const router = express.Router();

router.get('/', asyncHandler(genreController.list));
router.get('/options', asyncHandler(genreController.options));
router.get('/:id', asyncHandler(genreController.show));

router.post('/', requireAuth, asyncHandler(genreController.create));
router.put('/:id', requireAuth, asyncHandler(genreController.update));
router.delete('/:id', requireAuth, asyncHandler(genreController.remove));

module.exports = router;
