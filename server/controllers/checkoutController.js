const mongoose = require('mongoose');
const EventRequest = require('../models/EventRequest');
const Ticket = require('../models/Ticket');
const Metrics = require('../models/Metrics'); // Import the Metrics model

// Function to update the dashboard metrics
const updateMetrics = async (quantity, totalPrice) => {
  try {
    let metrics = await Metrics.findOne();
    
    if (!metrics) {
      metrics = new Metrics();
    }

    metrics.totalTicketSold += quantity;
    metrics.grossSales += totalPrice;

    await metrics.save();
  } catch (error) {
    console.error('Error updating metrics:', error.message);
  }
};

const checkoutController = {
  checkoutTickets: async (req, res) => {
    const { eventId, tickets } = req.body; // Expecting an array of tickets

    try {
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ error: 'Invalid event ID format' });
      }

      const objectId = new mongoose.Types.ObjectId(eventId);
      const eventRequests = await EventRequest.findById(objectId);

      if (!eventRequests) {
        return res.status(404).json({ error: 'Event not found' });
      }

      let totalQuantity = 0;
      let totalAmount = 0;

      // Retrieve the user ID from the JWT middleware
      const userId = req.user._id;

      for (const { type, quantity } of tickets) {
        const ticketType = eventRequests.ticketTypes.find(t => t.type === type);

        if (!ticketType) {
          return res.status(404).json({ error: `Ticket type '${type}' not found` });
        }

        if (ticketType.quantity < quantity) {
          return res.status(400).json({ error: `Sold out for ticket type '${type}'` });
        }

        ticketType.quantity -= quantity;
        totalQuantity += quantity;
        totalAmount += ticketType.price * quantity;

        // Create a ticket record for each purchased ticket
        for (let i = 0; i < quantity; i++) {
          await checkoutController.createTicketRecord(eventRequests, type, ticketType.price, userId);
        }
      }

      await eventRequests.save();
      await updateMetrics(totalQuantity, totalAmount);

      return res.status(200).json({ message: 'Checkout successful', event: eventRequests });
    } catch (error) {
      console.error('Error during checkout:', error.message);
      res.status(500).send('Internal Server Error');
    }
  },

  createTicketRecord: async (eventRequests, type, price, userId) => {
    try {
      const generatedTicketId = `TICKET-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      await Ticket.create({
        eventId: eventRequests._id,
        ticketId: generatedTicketId,
        type,
        price,
        quantity: 1, // Single ticket
        purchaseDate: new Date(),
        userId
      });

      console.log('Ticket record created successfully');
    } catch (error) {
      console.error('Error creating ticket record:', error);
    }
  }
};

module.exports = {
  checkoutTickets: checkoutController.checkoutTickets,
  createTicketRecord: checkoutController.createTicketRecord
};
