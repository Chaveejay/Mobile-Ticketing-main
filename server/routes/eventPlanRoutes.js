const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const eventPlanController = require('../controllers/eventPlanController');

// Only admins 
router.post('/create', verifyToken(['Admin']), eventPlanController.createEventPlan);
router.put('/:id', verifyToken(['Admin']), eventPlanController.updateEventPlan);
router.delete('/:id', verifyToken(['Admin']), eventPlanController.deleteEventPlan);

// All users 
router.get('/', eventPlanController.getAllEventPlans);
router.get('/:id', eventPlanController.getEventPlanById);

module.exports = router;
