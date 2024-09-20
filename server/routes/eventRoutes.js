const express = require('express');
const router = express.Router();
// const upload = require('../config/multer'); // Ensure you have the multer configuration here

const { createEvent, getEvents, searchEvents, getEventById, validate,getCategories, getEventsByCategory, handleStatusChange,getPendingEvents, getEventRequestById } = require('../controllers/eventController');
const {checkoutTickets,createTicketRecord} = require('../controllers/checkoutController'); // Import the checkout controller
const {getUserTickets} = require('../controllers/ticketController');
const {getEventRequests, getRequestById,updateRequestById,addVerifier, editVerifier, getVerifiers} = require('../controllers/eventRequestController');
const {getUpcomingEvents} = require('../controllers/eventController')
const authenticateToken = require('../middleware/authenticateToken'); 

// Middleware to check user role
const checkUserRole = (req, res, next) => {
    const userRole = req.user.role; // Assuming req.user is populated with user info
    if (userRole !== "User") {
      return res.status(403).json({ message: "Access forbidden: Users only." });
    }
    next();
  };

  const checkOrganizerRole = (req, res, next) => {
    const userRole = req.user.role;
    if (userRole !== "Organizer") {
      return res.status(403).json({ message: "Access forbidden: Organizers only." });
    }
    next();
};
// Define routes
router.post('/new-events', authenticateToken,checkOrganizerRole, validate.createEvent, createEvent);
router.get('/events', getEvents);
router.get('/search', searchEvents);
router.get('/events/:id', getEventById);
router.post('/checkout', authenticateToken, checkoutTickets);
router.post('/create-ticket',authenticateToken,createTicketRecord);
router.get('/mytickets', authenticateToken, getUserTickets);
router.get('/categories', getCategories);
router.get('/category/:category', getEventsByCategory);
router.get('/upcoming-events',getUpcomingEvents)

// event organizer
router.get('/myevents', authenticateToken, checkOrganizerRole, getEventRequests);
router.get('/event-edit/:id',getRequestById);
router.put('/event-edit/:id',updateRequestById);
router.patch('/events/:id/status', authenticateToken, handleStatusChange);
router.post('/add-verifier', addVerifier);
router.get('/verifiers/:eventId', getVerifiers);
router.put('/edit-verifier/:eventId', editVerifier);

// SLT Admin
router.get('/admin-pending-requests',getPendingEvents);
router.get('/admin-request-approve/:id',getEventRequestById);

module.exports = router;
