const { body, validationResult } = require('express-validator');
const EventRequest = require('../models/EventRequest');
const Notification = require ('../models/Notification')
const moment = require('moment');


const validate = {
  createEvent: [
    body('eventTitle').notEmpty().withMessage('Event title is required'),
    body('eventDate').isISO8601().withMessage('Event date is required and should be a valid ISO 8601 date'),
    body('timeFrom').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Event start time is required and should be in HH:mm format'),
    body('timeTo').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Event end time should be in HH:mm format'),
    body('venue').notEmpty().withMessage('Event venue is required'),
    body('category').isIn(['Music', 'Dance', 'Sports', 'Festival', 'Art', 'Education', 'Charity', 'Exhibition', 'Fitness', 'Fashion', 'Gaming', 'Auto', 'Tech', 'Kids']).withMessage('Category should be one of the predefined options'),

    body('ticketTypes').optional().isArray().withMessage('Ticket types should be an array'),
    body('ticketTypes.*.type').notEmpty().withMessage('Ticket type is required and should be one of the predefined options'),
    body('ticketTypes.*.price').isFloat({ gt: 0 }).withMessage('Ticket price should be a positive number'),
    body('ticketTypes.*.quantity').isInt({ gt: 0 }).withMessage('Ticket quantity should be a positive integer'),


    // Validation for single Promotional Offer
    body('offerName').optional().isString().withMessage('Offer name should be a string'),
    body('offerDateFrom').optional().isISO8601().withMessage('Promotional offer date should be a valid ISO 8601 date'),
    body('offerDateTo').optional().isISO8601().withMessage('Promotional offer date should be a valid ISO 8601 date'),
    body('offer').optional().isString().withMessage('Promotional offer description should be a string'),

    // Validation for single Contact Info
    body('fullName').optional().isString().withMessage('Contact full name should be a string'),
    body('email').optional().isEmail().withMessage('Contact email should be a valid email address'),
    body('phoneNumber').optional().isMobilePhone('any').withMessage('Contact phone number should be valid'),

    body('status').optional().isIn(['Pending', 'Approved', 'Declined']).withMessage('Status should be one of the following: pending, approved, declined')

  ]
};

// Event controller
const eventController = {

  async createEvent (req, res)  {
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if the user is an event organizer
        if (req.user.role !== 'Organizer') {
            return res.status(403).json({ error: 'Unauthorized: Only event organizers can create events' });
        }

        // Convert ticketTypes to the correct format
        const ticketTypes = req.body.ticketTypes.map(ticket => ({
            type: ticket.type || '', // Default to empty string if not provided
            price: parseFloat(ticket.price) || 0, // Default to 0 if not provided
            quantity: parseInt(ticket.quantity, 10) || 0, // Default to 0 if not provided
        }));

        // Construct event data
        const eventData = {
            eventTitle: req.body.eventTitle,
            eventDate: req.body.eventDate,
            timeFrom: req.body.timeFrom,
            timeTo: req.body.timeTo,
            venue: req.body.venue,
            description: req.body.description,
            category: req.body.category,
            bannerImage: req.files?.bannerImage?.[0]?.filename || null,
            ticketImage: req.files?.ticketImage?.[0]?.filename || null,
            ticketTypes: ticketTypes, // Ensure this is always an array

            offerName: req.body.offerName,
            offerDateFrom: req.body.offerDateFrom,
            offerDateTo: req.body.offerDateTo,
            offer: req.body.offer,
            fullName: req.body.fullName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            additionalNotes: req.body.additionalNotes,
            organizerId: req.user._id,  // Store the organizer's ID
            createdAt: Date.now(),
            status: 'Pending'
        };

        console.log('Saved Event Request Data:', eventData);

        // Save the event request in the database
        const newEventRequest = new EventRequest(eventData);
        const savedEventRequest = await newEventRequest.save();

        // Create a notification for the new event request
        const newNotification = new Notification({
            eventId: savedEventRequest._id, // Include eventId in the notification
            userId: req.user._id,  // Ensure userId is provided
            eventTitle: newEventRequest.eventTitle,
            status: 'Pending',
            message: `New event "${newEventRequest.eventTitle}" is pending approval.`,
        });

        await newNotification.save();

        res.status(201).json({ message: 'Event request submitted successfully!' });
    } catch (error) {
        console.error('Error saving event request:', error);
        res.status(500).json({ error: 'Error submitting the event request' });
    }
},



    // Add the handleStatusChange function here
    async handleStatusChange (req, res)  {
      const { id } = req.params;  // Event request ID
      const { status } = req.body;  // New status ('Approved' or 'Declined')
    
      try {
        // Find the event request by ID
        const eventRequest = await EventRequest.findById(id);
    
        if (!eventRequest) {
          return res.status(404).json({ error: 'Event request not found' });
        }
    
        // Update the event status
        eventRequest.status = status;
        await eventRequest.save();
    
        // Create a notification for the event organizer
        const newNotification = new Notification({
          userId: eventRequest.organizerId,  // Link the notification to the organizer
          eventId: eventRequest._id,
          eventTitle: eventRequest.eventTitle,
          status: status,
          message: `Your event "${eventRequest.eventTitle}" has been ${status.toLowerCase()}.`,
        });
    
        await newNotification.save();
    
        res.status(200).json({ message: `Event request ${status.toLowerCase()} successfully.` });
      } catch (error) {
        console.error('Error updating event status:', error);
        res.status(500).json({ error: 'Error updating the event status' });
      }
    },
    
  async getEvents(req, res) {
    try {
      // Find only events with status "Approved"
      const approvedEvents = await EventRequest.find({ status: 'Approved' });
      console.log('Fetched approved event requests:', approvedEvents);
      res.status(200).json(approvedEvents);
    } catch (error) {
      console.error('Error fetching event requests:', error.message);
      res.status(500).send('Internal Server Error');
    }
  },

  async getPendingEvents(req, res) {
    try {
      const pendingRequests = await EventRequest.find({ status: 'Pending' });
      res.json(pendingRequests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      res.status(500).json({ message: 'Server Error' });
  }
  },


  async getEventRequestById(req, res) {
    try {
      // Find the event request by ID and ensure it has a status of "Pending"
      const eventRequest = await EventRequest.findOne({ _id: req.params.id, status: 'Pending' });
  
      // If no event request is found, return a 404 response
      if (!eventRequest) {
        return res.status(404).json({ message: 'Pending event request not found' });
      }
  
      // Return the found event request
      res.status(200).json(eventRequest);
    } catch (error) {
      // Handle any server errors
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  
  async searchEvents(req, res) {
    try {
      const { query } = req.query;
      if (typeof query !== 'string' || query.trim() === '') {
        return res.status(400).json({ error: 'Invalid search query' });
      }

      const regex = new RegExp(query.trim(), 'i');
      const events = await EventRequest.find({
        $or: [
          { eventTitle: { $regex: regex } },
          { category: { $regex: regex } },
          { venue: { $regex: regex } }
        ]
      });

      res.status(200).json(events);
    } catch (error) {
      console.error('Error searching events:', error.message);
      res.status(500).send('Internal Server Error');
    }
  },

  async getEventById(req, res) {
    try {
      const eventId = req.params.id;
      const eventRequests = await EventRequest.findById(eventId);

      if (!eventRequests) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.status(200).json(eventRequests);
    } catch (error) {
      console.error('Error fetching event by ID:', error.message);
      res.status(500).send('Internal Server Error');
    }
  },

  // GET /categories
  async getCategories(req, res)  {
    // This route may just return a list of category names as it's managed by frontend
    const categories = ["Music", "Dance", "Sport", "Festival", "Art", "Education", "Charity", "Exhibition", "Fitness", "Fashion", "Gaming", "Auto", "Tech", "Kids"]
    ;
    res.json(categories);
  },

  async getEventsByCategory(req, res) {
    try {
      const { category } = req.params;
  
      // Perform a case-insensitive query
      const eventsByCategory = await EventRequest.find({ category: new RegExp(`^${category}$`, "i") });
      res.json(eventsByCategory);
    } catch (err) {
      console.error('Error fetching events by category:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  },
  

  async getUpcomingEvents(req, res) {
    try {
        const today = moment().startOf('day').toDate();
        const endOfMonth = moment().endOf('month').toDate();

        // Log the date range for debugging
        console.log('Date range:', today, 'to', endOfMonth);

        // Fetch approved events happening from today until the end of the current month
        const upcomingEvents = await EventRequest.find({
            eventDate: {
                $gte: today,
                $lte: endOfMonth,
            },
            status: 'Approved' // Add this line to filter by approved status
        }).limit(4);

        // Log the fetched events
        console.log('Fetched Events:', upcomingEvents);

        res.json(upcomingEvents);
    } catch (err) {
        console.error('Error fetching upcoming events:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
},



// Example function to update verifier contact
 async updateVerifierContact(req, res) {
  try {
    const { id } = req.params;
    const { verifierContact } = req.body;

    const updatedEventRequest = await EventRequest.findByIdAndUpdate(
      id,
      { verifierContact },
      { new: true }
    );

    if (!updatedEventRequest) {
      return res.status(404).json({ message: 'Event request not found' });
    }

    res.status(200).json(updatedEventRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},


};

module.exports = {
  createEvent: eventController.createEvent,
  getEvents: eventController.getEvents,
  getApprovedEvents: eventController.getApprovedEvents,
  searchEvents: eventController.searchEvents,
  getEventById: eventController.getEventById,
  validate,
  getCategories:eventController.getCategories,
  getEventsByCategory: eventController.getEventsByCategory,
  getEventRequests: eventController.getEventRequests,
  getUpcomingEvents:  eventController.getUpcomingEvents,
  handleStatusChange: eventController.handleStatusChange,
  getPendingEvents: eventController.getPendingEvents,
  getEventRequestById: eventController.getEventRequestById
};
