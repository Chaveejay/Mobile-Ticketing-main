const express = require('express');
const router = express.Router();
const adminDashController = require('../controllers/adminDashController');

// Admin routes
router.get('/monthly-user-registrations', adminDashController.getMonthlyUserRegistrations);
router.get('/user-roles-distribution', adminDashController.getUserRolesDistribution);
router.get('/daily-event-registrations', adminDashController.getDailyEventRegistrations);
router.get('/event-status-counts', adminDashController.getEventStatusCounts);

module.exports = router;
