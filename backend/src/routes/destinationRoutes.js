const express = require('express');
const router = express.Router();
const { getDestinations, getDestinationById, getCategories } = require('../controllers/destinationController');

// Public routes — no auth required
router.get('/categories', getCategories);
router.get('/', getDestinations);
router.get('/:id', getDestinationById);

module.exports = router;
