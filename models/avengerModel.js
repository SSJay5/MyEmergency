const mongoose = require('mongoose');

const avengerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  phoneNumber: {
    type: Number,
    required: [true, 'Please Provide the Phone number'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

const Avenger = new mongoose.model('Avenger', avengerSchema);

module.exports = Avenger;
