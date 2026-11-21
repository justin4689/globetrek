const { prisma } = require('../config/db');
const serialize = require('../utils/serialize');

const destinationFields = {
  id: true, name: true, country: true, price: true, rating: true,
  images: true, isFeatured: true, category: true,
};

// ─── GET /favorites ────────────────────────────────────────────────────────────

const getFavorites = async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: { destination: { select: destinationFields } },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, favorites: serialize(favorites) });
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

    const favorite = await prisma.favorite.create({
      data: { userId: req.user.id, destinationId: String(destinationId) },
      include: { destination: { select: destinationFields } },
    });

    res.status(201).json({ success: true, favorite: serialize(favorite) });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Already in favorites' });
    }
    if (error.code === 'P2003') {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    console.error('addFavorite error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── DELETE /favorites/:destinationId ─────────────────────────────────────────

const removeFavorite = async (req, res) => {
  try {
    const result = await prisma.favorite.deleteMany({
      where: { userId: req.user.id, destinationId: req.params.destinationId },
    });

    if (result.count === 0) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }

    res.status(200).json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    console.error('removeFavorite error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
