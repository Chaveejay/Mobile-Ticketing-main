const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

router.get('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('eventId');
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        console.error('Error fetching ticket:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST verify ticket
router.post('/verify', async (req, res) => {
    const { ticketId } = req.body;

    if (!ticketId) {
        return res.status(400).json({ message: 'Ticket ID is required' });
    }

    try {
        const ticket = await Ticket.findOne({ ticketId });

        if (ticket) {
            res.status(200).json({ message: 'Ticket is approved' });
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        console.error('Error verifying ticket:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
