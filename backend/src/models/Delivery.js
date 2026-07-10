const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Order'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Picked Up', 'Delivered'],
    default: 'Pending'
  },
  pickupTime: {
    type: Date
  },
  deliveryTime: {
    type: Date
  },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Delivery', deliverySchema);
