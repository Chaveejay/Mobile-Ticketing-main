const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'bannerImage' || file.fieldname === 'ticketImage') {
    cb(null, true); // Accept files with the correct field names
  } else {
    cb(new Error('Unexpected field'), false); // Reject unexpected fields
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
