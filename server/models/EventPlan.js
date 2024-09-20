const mongoose = require('mongoose');

const eventPlanSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    price: { type: Number, required: true },
    no_of_events: { type: Number, required: true },
    no_of_tickets: { type: Number, required: true },
    no_of_edits: { type: Number, required: true },
});

module.exports = mongoose.model('EventPlan', eventPlanSchema);
