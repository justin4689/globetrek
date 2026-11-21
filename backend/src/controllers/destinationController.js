const { prisma } = require('../config/db');
const serialize = require('../utils/serialize');

const CATEGORIES = ['Beach', 'Mountain', 'Lake', 'Desert', 'Forest', 'City'];

// ─── GET /destinations ─────────────────────────────────────────────────────────
// Query params: category, search, featured, page, limit

const getDestinations = async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));

    const where = {};
    if (category) {
      if (!CATEGORIES.includes(category)) {
        return res.status(200).json({ success: true, total: 0, page, pages: 0, destinations: [] });
      }
      where.category = category;
    }
    if (featured === 'true') where.isFeatured = true;
    // MySQL default collation is case-insensitive, like the former $regex 'i'
    if (search) where.name = { contains: String(search) };

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({ where, skip: (page - 1) * limit, take: limit }),
      prisma.destination.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      destinations: serialize(destinations),
    });
  } catch (error) {
    console.error('getDestinations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET /destinations/:id ─────────────────────────────────────────────────────

const getDestinationById = async (req, res) => {
  try {
    const destination = await prisma.destination.findUnique({
      where: { id: req.params.id },
      include: { reviews: true },
    });
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.status(200).json({ success: true, destination: serialize(destination) });
  } catch (error) {
    console.error('getDestinationById error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET /destinations/categories ─────────────────────────────────────────────

const getCategories = async (req, res) => {
  const categories = [
    { id: '1', name: 'Beach', icon: 'beach' },
    { id: '2', name: 'Mountain', icon: 'image-filter-hdr' },
    { id: '3', name: 'Lake', icon: 'waves' },
    { id: '4', name: 'Desert', icon: 'weather-sunny' },
    { id: '5', name: 'Forest', icon: 'forest' },
    { id: '6', name: 'City', icon: 'city' },
  ];
  res.status(200).json({ success: true, categories });
};

module.exports = { getDestinations, getDestinationById, getCategories };
