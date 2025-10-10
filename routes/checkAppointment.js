const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');

router.get('/', (req, res) => {
  res.render('check-appointment', { appointment: null, error: null });
});

router.post('/', async (req, res) => {
  const { phone, appointmentDate, appointmentTime } = req.body;

  try {
    const appointment = await Consultation.findOne({
      phone,
      appointmentDate,
      appointmentTime
    });

    if (!appointment) {
      return res.render('check-appointment', {
        appointment: null,
        error: 'No appointment found with the provided details.'
      });
    }

    res.render('check-appointment', {
      appointment,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.render('check-appointment', {
      appointment: null,
      error: 'Something went wrong. Please try again later.'
    });
  }
});

module.exports = router;
