const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Consultation = require('../models/Consultation');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Only .jpeg, .jpg, .png, .webp image formats allowed"));
  }
});

// Render form page
router.get('/', (req, res) => {
  res.render('consultation');
});


// Handle form submission with image upload
router.post('/', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const { appointmentDate, appointmentTime, transactionId, diseases } = req.body;

    // Prevent duplicate appointment date + time
    const isBooked = await Consultation.findOne({ appointmentDate, appointmentTime });

    if (isBooked) {
      return res.send(`
        <script>
            alert("Sorry, this appointment date is already booked. Please select another date or time.");
            window.location.href = "/consultation";
        </script>
      `);
    }

    // Ensure transaction ID is unique
    const existingTxn = await Consultation.findOne({ transactionId });
    if (existingTxn) {
      return res.send(`
        <script>
          alert("This transaction ID has already been used. Please enter a valid one.");
          window.location.href = "/consultation";
        </script>
      `);
    }

    // Save the form data
    const data = new Consultation({
      ...req.body,
      appointmentDate,
      appointmentTime,
      transactionId,
      diseases: Array.isArray(diseases) ? diseases : (diseases ? [diseases] : []),
      paymentScreenshot: req.file ? req.file.filename : null
    });

    await data.save();

    res.send(`
      <script>
        alert("Thank you! Your consultation has been submitted successfully.");
        window.location.href = "/";
      </script>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send(`
      <script>
        alert("Something went wrong. Please try again later.");
        window.location.href = "/";
      </script>
    `);
  }
});


module.exports = router;