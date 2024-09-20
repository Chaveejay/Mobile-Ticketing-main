// controllers/notificationController.js
const Notification = require('../models/Notification'); // Adjust the path accordingly
const EventRequest = require('../models/EventRequest');

// Get notifications for a specific user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

// Get notifications by status
const getNotificationsByStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.params;
    const notifications = await Notification.find({ userId, status }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error updating notification:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

const createNotification = async (userId, eventTitle, status) => {
  const message = `The ${eventTitle} event request is ${status}.`;
  await Notification.create({ eventTitle, message, status, userId });
};

const updateNotificationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Should be 'Approved' or 'Declined'

  try {
      const notification = await Notification.findById(id);

      if (!notification) {
          return res.status(404).json({ message: 'Notification not found' });
      }

      notification.status = status;
      await notification.save();

      res.status(200).json(notification);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const updateEventRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Validate the status value
    if (!['Approved', 'Declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the event request by ID and update its status
    const eventRequest = await EventRequest.findById(id);
    if (!eventRequest) {
      return res.status(404).json({ message: 'Event request not found' });
    }

    eventRequest.status = status;
    await eventRequest.save();

    // Create a notification for the event organizer
    const newNotification = new Notification({
      userId: eventRequest.organizerId, // Ensure this field is correctly populated in your schema
      eventId: eventRequest._id,
      eventTitle: eventRequest.eventTitle,
      message: `Your event "${eventRequest.eventTitle}" has been ${status.toLowerCase()}.`,
      status: status,
    });

    await newNotification.save();

    // Respond with the updated event request and a success message
    res.status(200).json({ message: `Event request ${status.toLowerCase()} successfully.`, eventRequest });
  } catch (error) {
    console.error('Error updating event status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createNotification,
  getNotifications,
  getNotificationsByStatus,
  markNotificationAsRead,
  updateNotificationStatus,
  updateEventRequestStatus
};
