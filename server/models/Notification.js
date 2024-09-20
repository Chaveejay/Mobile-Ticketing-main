// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventRequest', required: true },
    eventTitle: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Declined'], default: 'Pending' },
    read: { type: Boolean, default: false }
  }, { timestamps: true });
  

module.exports = mongoose.model('Notification', notificationSchema);
