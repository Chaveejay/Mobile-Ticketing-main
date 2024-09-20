const Ticket = require('../models/Ticket');

const ticketController = {
    getUserTickets: async (req, res) => {
        try {
            // Extract the user ID from the authenticated user data
            const userId = req.user._id;
            console.log('Fetching tickets for user ID:', userId);

1            // Fetch tickets associated with this user
            const tickets = await Ticket.find({ userId }).populate('eventId');
            console.log('Tickets found:', tickets);

            if (tickets.length === 0) {
                return res.status(404).json({ message: 'No tickets found' });
            }

            res.status(200).json(tickets);
        } catch (error) {
            console.error('Error fetching tickets:', error.message);
            res.status(500).send('Internal Server Error');
        }
    }
};

module.exports = ticketController;
