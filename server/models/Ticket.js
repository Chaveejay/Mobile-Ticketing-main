const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventRequest', required: true },

  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
