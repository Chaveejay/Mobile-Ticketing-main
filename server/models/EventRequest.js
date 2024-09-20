// models/EventRequest.js

const mongoose = require('mongoose');

const EventRequestSchema = new mongoose.Schema({
  eventTitle: { type: String, required: true },
  eventDate: { type: Date, required: true },
  timeFrom: { type: String, required: true },
  timeTo: { type: String, required: true },
  venue: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  bannerImage: { type: String },
  ticketImage: { type: String },
  ticketTypes: [
    {
      type: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  offerName: { type: String },
  offerDateFrom: { type: Date },
  offerDateTo: { type: Date },
  offer: { type: String },
  fullName: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  additionalNotes: { type: String },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Declined'], 
    default: 'Pending' 
  }
}, { collection: 'eventRequest' });

module.exports = mongoose.model('EventRequest', EventRequestSchema);
