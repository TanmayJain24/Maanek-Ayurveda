const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Consultation = require('../models/Consultation');
require('dotenv').config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'paymentScreenshots', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

const upload = multer({ storage });

// Render form
router.get('/', (req, res) => {
  res.render('consultation');
});

// Handle form submission
router.post('/', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const { appointmentDate, appointmentTime, transactionId, diseases } = req.body;

    // Prevent duplicate appointment
    const isBooked = await Consultation.findOne({ appointmentDate, appointmentTime });
    if (isBooked) return res.send(`<script>alert("This appointment slot is booked."); window.location.href="/consultation";</script>`);

    // Prevent duplicate transaction ID
    const existingTxn = await Consultation.findOne({ transactionId });
    if (existingTxn) return res.send(`<script>alert("Transaction ID already used."); window.location.href="/consultation";</script>`);

    // Save to DB
    const data = new Consultation({
      ...req.body,
      diseases: Array.isArray(diseases) ? diseases : (diseases ? [diseases] : []),
      paymentScreenshot: req.file ? req.file.path : null
    });

    await data.save();

    res.send(`<script>alert("Consultation submitted successfully!"); window.location.href="/";</script>`);

  } catch (err) {
    console.error(err);
    res.status(500).send(`<script>alert("Something went wrong."); window.location.href="/";</script>`);
  }
});

module.exports = router;