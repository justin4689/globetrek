const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, default: '' },
  rating: { type: Number, required: true, min: 0, max: 5 },
  text: { type: String, required: true },
});

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Beach', 'Mountain', 'Lake', 'Desert', 'Forest', 'City'],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    images: [{ type: String }],
    description: { type: String, required: true },
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

destinationSchema.virtual('image').get(function () {
  return this.images[0] || '';
});

module.exports = mongoose.model('Destination', destinationSchema);
