const express = require('express');
const router = express.Router();
const Service = require('../models/service'); // Make sure model name matches

// Route to get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ title: 1 }); // optional sort
    res.render('services', { services });
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Dynamic route for single service by slug
router.get('/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) {
      return res.status(404).render('error', { message: 'Service Not Found' });
    }

    res.render('dynamic-service', { service });
  } catch (err) {
    console.error('Error fetching service:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;