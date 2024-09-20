// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const {getNotifications,getNotificationsByStatus,markNotificationAsRead,updateNotificationStatus,updateEventRequestStatus} = require('../controllers/notificationController'); // Adjust the path accordingly
const authenticateToken = require('../middleware/authenticateToken');



// Get notifications for a specific user
router.get('/notifications', authenticateToken,getNotifications);

// Get notifications by status
router.get('/notifications/:status', authenticateToken,getNotificationsByStatus);

// Mark notification as read
router.patch('/notifications/:id/read',authenticateToken, markNotificationAsRead);

router.patch('/notifications/:id/status', authenticateToken, updateNotificationStatus);
router.patch('/admin-request-approve/:id/status', updateEventRequestStatus);


module.exports = router;
