// models/Verifier.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verifierSchema = new Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventRequest',
    required: true,
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  verifierPhoneNumbers: {
    type: [String],
    validate: [arrayLimit, 'You can only add up to 3 phone numbers'],
    required: true,
  },
});

function arrayLimit(val) {
  return val.length <= 3;
}

module.exports = mongoose.model('Verifier', verifierSchema);
