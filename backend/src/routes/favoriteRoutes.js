const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoriteController');

router.use(protect);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:destinationId', removeFavorite);

module.exports = router;
