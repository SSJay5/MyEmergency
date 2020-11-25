"use strict";

var mongoose = require('mongoose');

var avengerSchema = new mongoose.Schema({
  name: {
    type: String
  },
  phoneNumber: {
    type: Number,
    required: [true, 'Please Provide the Phone number']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});
var Avenger = new mongoose.model('Avenger', avengerSchema);
module.exports = Avenger;