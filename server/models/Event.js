const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
  eventTitle: { type: String, required: true },
  eventDate: { type: Date, required: true },
  timeFrom: { type: String, required: true },
  timeTo: { type: String },
  venue: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: ['Music', 'Dance', 'Sports', 'Festival', 'Art', 'Education', 'Charity', 'Exhibition', 'Fitness', 'Fashion', 'Gaming', 'Auto', 'Tech', 'Kids'],
    required: true
  },
  bannerImage: { type: String },  // Store banner image path
  ticketImage: { type: String },  // Store ticket image path

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
  email: {
    type: String,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  phoneNumber: { type: String },

  additionalNotes: { type: String }
  
}, { collection: 'eventDetails' });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
