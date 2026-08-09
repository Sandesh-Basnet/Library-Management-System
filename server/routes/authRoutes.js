'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/asyncHandler');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', asyncHandler(authController.login));
router.post('/logout', authController.logout);
router.get('/me', authController.me);

module.exports = router;
