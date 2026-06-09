const Favorite = require('../models/Favorite');

// ─── GET /favorites ────────────────────────────────────────────────────────────

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate('destination', 'name country price rating images isFeatured category')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, favorites });
  } catch (error) {
    console.error('getFavorites error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── POST /favorites ───────────────────────────────────────────────────────────

const addFavorite = async (req, res) => {
  try {
    const { destinationId } = req.body;

    if (!destinationId) {
      return res.status(400).json({ success: false, message: 'destinationId is required' });
    }

    const favorite = await Favorite.create({ user: req.user.id, destination: destinationId });
    await favorite.populate('destination', 'name country price rating images category');

    res.status(201).json({ success: true, favorite });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Already in favorites' });
    }
    console.error('addFavorite error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── DELETE /favorites/:destinationId ─────────────────────────────────────────

const removeFavorite = async (req, res) => {
  try {
    const result = await Favorite.findOneAndDelete({
      user: req.user.id,
      destination: req.params.destinationId,
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }

    res.status(200).json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    console.error('removeFavorite error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
