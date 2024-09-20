const mongoose = require('mongoose');

const metricsSchema = new mongoose.Schema({
  totalTicketSold: {
    type: Number,
    default: 0
  },
  grossSales: {
    type: Number,
    default: 0
  }
});

const Metrics = mongoose.model('Metrics', metricsSchema);

module.exports = Metrics;
