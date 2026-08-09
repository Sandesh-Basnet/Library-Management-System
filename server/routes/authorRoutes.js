'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const authorController = require('../controllers/authorController');

const router = express.Router();

router.get('/', asyncHandler(authorController.list));
router.get('/options', asyncHandler(authorController.options));
router.get('/:id', asyncHandler(authorController.show));

router.post('/', requireAuth, asyncHandler(authorController.create));
router.put('/:id', requireAuth, asyncHandler(authorController.update));
router.delete('/:id', requireAuth, asyncHandler(authorController.remove));

module.exports = router;
