const EventRequest = require('../models/EventRequest');
const Verifier = require('../models/Verifier');
const User = require ('../models/User')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const eventRequestController = {

    async getEventRequests(req, res) {
        try {
            const organizerId = req.user._id; // Extract organizer ID from token
            console.log('Organizer ID:', organizerId);
    
            // Check if user role is 'Organizer' (if role-based access is needed)
            if (req.user.role !== 'Organizer') {
                return res.sendStatus(403); // Forbidden if user is not an Organizer
            }
    
            // Fetch event requests for the organizer with status 'Approved'
            const eventRequests = await EventRequest.find({
                organizerId,
                status: 'Approved' // Filter by approved status
            });
            console.log('Event Requests:', eventRequests);
    
            if (eventRequests.length === 0) {
                return res.status(404).json({ message: 'No approved event requests found.' });
            }
    
            res.status(200).json(eventRequests);
        } catch (error) {
            console.error('Error fetching events:', error.message);
            res.status(500).send('Internal Server Error');
        }
    },
    
    async getRequestById(req, res) {
        try {
            const eventRequest = await EventRequest.findById(req.params.id);
            if (!eventRequest) return res.status(404).json({ message: 'Request not found' });
            res.json(eventRequest);
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    },
    

    async updateRequestById(req, res) {
        try {

            console.log('Request Body:', req.body);
            console.log('Request Files:', req.files);
    
    
            const updateFields = {};
    
            // Add fields to update only if they are defined
            if (req.body.eventTitle !== undefined) updateFields.eventTitle = req.body.eventTitle;
            if (req.body.eventDate !== undefined) updateFields.eventDate = req.body.eventDate;
            if (req.body.timeFrom !== undefined) updateFields.timeFrom = req.body.timeFrom;
            if (req.body.timeTo !== undefined) updateFields.timeTo = req.body.timeTo;
            if (req.body.venue !== undefined) updateFields.venue = req.body.venue;
            if (req.body.description !== undefined) updateFields.description = req.body.description;
            if (req.body.category !== undefined) updateFields.category = req.body.category;
            if (req.files?.bannerImage?.[0]?.filename !== undefined) updateFields.bannerImage = req.files.bannerImage[0].filename;
            if (req.files?.ticketImage?.[0]?.filename !== undefined) updateFields.ticketImage = req.files.ticketImage[0].filename;
            if (req.body.ticketTypes !== undefined) updateFields.ticketTypes = req.body.ticketTypes;
            if (req.body.offerName !== undefined) updateFields.offerName = req.body.offerName;
            if (req.body.offerDateFrom !== undefined) updateFields.offerDateFrom = req.body.offerDateFrom;
            if (req.body.offerDateTo !== undefined) updateFields.offerDateTo = req.body.offerDateTo;
            if (req.body.offer !== undefined) updateFields.offer = req.body.offer;
            if (req.body.fullName !== undefined) updateFields.fullName = req.body.fullName;
            if (req.body.email !== undefined) updateFields.email = req.body.email;
            if (req.body.phoneNumber !== undefined) updateFields.phoneNumber = req.body.phoneNumber;
            if (req.body.additionalNotes !== undefined) updateFields.additionalNotes = req.body.additionalNotes;
    
            console.log('Update Fields:', updateFields); // Log to check if fields are correct
    
            const updatedEventRequest = await EventRequest.findByIdAndUpdate(
                req.params.id,
                { $set: updateFields },
                { new: true, runValidators: true }
            );
    
            if (!updatedEventRequest) {
                return res.status(404).json({ message: "Event request not found" });
            }
    
            res.status(200).json({
                message: "Event request updated successfully",
                eventRequest: updatedEventRequest
            });
        } catch (error) {
            console.error("Error updating event request:", error);
            res.status(500).json({ message: "Error updating event request", error });
        }
    },


async addVerifier(req, res) {
    try {
      const { eventId, organizerId, phoneNumber } = req.body;
  
      // Validate required fields
      if (!eventId || !organizerId || !phoneNumber) {
        return res.status(400).json({ message: 'Missing required fields. Please provide eventId, organizerId, and phoneNumber.' });
      }
  
      // Validate the format of eventId and organizerId
      if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(organizerId)) {
        return res.status(400).json({ message: 'Invalid eventId or organizerId.' });
      }
  
      // Validate the phone number format
      const phoneNumberPattern = /^[0-9]{10}$/;
      if (!phoneNumberPattern.test(phoneNumber)) {
        return res.status(400).json({ message: 'Invalid phone number format. It should be 10 digits.' });
      }
  
      // Check if the event request exists
      const event = await EventRequest.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
      }
  
      // Check if the user (organizer) exists
      const organizer = await User.findById(organizerId);
      if (!organizer || organizer.role !== 'Organizer') {
        return res.status(404).json({ message: 'Organizer not found or is not an organizer.' });
      }
  
      // Check if verifier for this event and organizer already exists
      let verifier = await Verifier.findOne({ eventId, organizerId });
  
      if (verifier) {
        // If verifier exists, push new phone number to the verifierPhoneNumbers array
        if (!verifier.verifierPhoneNumbers.includes(phoneNumber)) {
          verifier.verifierPhoneNumbers.push(phoneNumber);
          await verifier.save();
        } else {
          return res.status(400).json({ message: 'Phone number already exists for this verifier.' });
        }
      } else {
        // If verifier doesn't exist, create a new entry
        verifier = new Verifier({
          eventId,
          organizerId,
          verifierPhoneNumbers: [phoneNumber]
        });
        await verifier.save();
      }
  
      res.status(200).json({ message: 'Verifier added successfully', verifier });
    } catch (error) {
      console.error('Error adding verifier:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getVerifiers(req, res) {
    const { eventId } = req.params;
    try {
      const verifier = await Verifier.findOne({ eventId });
      if (!verifier) {
        return res.status(404).json({ message: 'No verifier found for this event' });
      }
      res.status(200).json({ verifierPhoneNumbers: verifier.verifierPhoneNumbers });
    } catch (error) {
      console.error('Error fetching verifier:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async editVerifier(req, res) {
  const { eventId } = req.params;
  const { organizerId, phoneNumber, oldPhoneNumber } = req.body;  // oldPhoneNumber is only used for comparison
  
  try {
    // Fetch the current verifier
    const verifier = await Verifier.findOne({ eventId, organizerId });
    
    if (!verifier) {
      return res.status(404).json({ message: 'No verifier phone numbers found for this event.' });
    }

    // Find the index of oldPhoneNumber in the verifierPhoneNumbers array
    const index = verifier.verifierPhoneNumbers.findIndex(
      number => number.trim() === oldPhoneNumber.trim()
    );
    
    if (index === -1) {
      return res.status(404).json({ message: 'Old phone number not found in verifier.' });
    }

    // Update the phone number at the found index
    verifier.verifierPhoneNumbers[index] = phoneNumber;
    await verifier.save();

    res.status(200).json({ message: 'Verifier phone number updated successfully.' });
  } catch (error) {
    console.error('Error updating verifier phone number:', error);
    res.status(500).json({ message: 'Error updating verifier phone number.' });
  }
}

  
};

module.exports = {
    getEventRequests: eventRequestController.getEventRequests,
    getRequestById: eventRequestController.getRequestById,
    updateRequestById: eventRequestController.updateRequestById,
    addVerifier: eventRequestController.addVerifier,
    editVerifier: eventRequestController.editVerifier,
    getVerifiers:eventRequestController.getVerifiers
};