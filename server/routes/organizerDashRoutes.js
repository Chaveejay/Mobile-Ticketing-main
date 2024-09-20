const express = require('express');
const router = express.Router();
const organizerDashController = require('../controllers/organizerDashController');

router.get('/metrics', organizerDashController.getDashboardMetrics);
router.get('/monthly-tickets', organizerDashController.getMonthlyTicketsData);
router.get('/daily-tickets', organizerDashController.getDailyTicketsData);
router.get('/ticket-stats', organizerDashController.getTicketStats);

module.exports = router;
