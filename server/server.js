const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const multer = require('multer');
require('dotenv').config();
const eventRoutes = require('./routes/eventRoutes');
const Event = require('./models/Event'); 
const EventRequest = require('./models/EventRequest');
const { validate } = require('./controllers/eventController');

const eventController = require('./controllers/eventController');
const app = express();
const PORT = 5000;
const ticketRoutes = require('./routes/ticketRoutes');
const authRoute = require('./routes/auth');
const authenticateToken = require('./middleware/authenticateToken');
const eventPlanRoutes = require('./routes/eventPlanRoutes');
const paymentRoute = require('./routes/payment');
const webhookRoute = require('./routes/webhook');
const eventRequestController = require('./controllers/eventRequestController');
const notificationRoutes = require('./routes/notificationRoutes'); // Adjust the path accordingly
const adminDashRoutes = require('./routes/adminDashRoutes');

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Replace with the origin of your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true // Allow credentials (cookies, etc.)
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const URL = process.env.MONGODB_URI;
if (!URL) {
  console.error('Error: MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');  // Define your image upload path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Save the file with a unique name
  }
});


// Multer filter to handle different image fields
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'bannerImage' || file.fieldname === 'ticketImage') {
    cb(null, true); // Accept files if the fieldname matches
  } else {
    cb(new multer.MulterError('Unexpected field'), false); // Reject files with unexpected fieldnames
  }
};


// Create Multer upload instance
const upload = multer({ storage: storage, fileFilter: fileFilter });


app.post('/api/new-events', upload.fields([{ name: 'bannerImage' }, { name: 'ticketImage' }]),authenticateToken, validate.createEvent, eventController.createEvent);
// app.put('/event-edit/:id', upload.fields([{ name: 'bannerImage' }, { name: 'ticketImage' }]), eventRequestController.updateRequestById);

// app.put('/event-edit/:id', upload.fields([
//   { name: 'bannerImage', maxCount: 1 },
//   { name: 'ticketImage', maxCount: 1 }
// ]), eventRequestController.updateRequestById);


// POST route to handle form submission
app.post('/api/new-events', upload.fields([
  { name: 'bannerImage', maxCount: 1 },
  { name: 'ticketImage', maxCount: 1 }
]), async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Uploaded Files:', req.files);

  if (!req.files.bannerImage && !req.files.ticketImage) {
    console.log('No file uploaded or file field name is incorrect');
    return res.status(400).json({ error: 'No file uploaded or file field name is incorrect' });
  }

  if (!req.body.eventTitle || !req.body.eventDate || !req.body.timeFrom || !req.body.timeTo || !req.body.venue || !req.body.category ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  

});



// Route to get image by filename
app.get('/api/events/:id/image/:type', (req, res) => {
  const eventId = req.params.id;
  const imageType = req.params.type; // 'banner' or 'ticket'

  Event.findById(eventId, (err, event) => {
    if (err || !event) {
      return res.status(404).send('Event not found');
    }

    let imagePath;
    if (imageType === 'banner') {
      imagePath = event.bannerImage; // Assume 'bannerImage' contains the filename or path
    } else if (imageType === 'ticket') {
      imagePath = event.ticketImage; // Assume 'ticketImage' contains the filename or path
    } else {
      return res.status(400).send('Invalid image type');
    }

    if (!imagePath) {
      return res.status(404).send('Image not found');
    }

    res.sendFile(imagePath, { root: __dirname });
  });
});

// Routes
app.use('/api', eventRoutes);


// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Test Route
app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/dashboard', require('./routes/organizerDashRoutes'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Use raw body middleware for webhook route
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoute);

// Middleware
app.use(express.json());
app.use(bodyParser.json());


app.use('/api', ticketRoutes);
app.use('/api/user', authRoute);
app.use('/api/event-plans', eventPlanRoutes);
app.use('/api/payment', paymentRoute);
app.use('/api', notificationRoutes);
app.use('/api', adminDashRoutes);
