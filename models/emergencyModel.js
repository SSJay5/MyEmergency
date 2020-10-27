const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    default: false,
  },
});

emergencySchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

emergencySchema.index({ location: '2dsphere' });

const Emergency = new mongoose.model('Emergency', emergencySchema);

module.exports = Emergency;
