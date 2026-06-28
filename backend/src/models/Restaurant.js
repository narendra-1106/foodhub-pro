const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a restaurant name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  cuisines: {
    type: [String],
    required: [true, 'Please add at least one cuisine type']
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false // Admin approval required
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Cascade delete menus when a restaurant is deleted (placeholder for tomorrow)
restaurantSchema.pre('remove', async function(next) {
  // await this.model('Menu').deleteMany({ restaurant: this._id });
  next();
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
