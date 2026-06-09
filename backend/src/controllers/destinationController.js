const Destination = require('../models/Destination');

// ─── GET /destinations ─────────────────────────────────────────────────────────
// Query params: category, search, featured, page, limit

const getDestinations = async (req, res) => {
  try {
    const { category, search, featured, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);

    const [destinations, total] = await Promise.all([
      Destination.find(filter).skip(skip).limit(Number(limit)).select('-reviews'),
      Destination.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      destinations,
    });
  } catch (error) {
    console.error('getDestinations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET /destinations/:id ─────────────────────────────────────────────────────

const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.status(200).json({ success: true, destination });
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
