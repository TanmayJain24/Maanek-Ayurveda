const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Service = require('../models/service');

// Route to display all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();

    const updatedServices = services.map(service => {
      const imageDir = path.join(__dirname, '..', 'public', 'images', 'ServiceImages');
      const possibleExtensions = ['.jpg', '.jpeg', '.png'];
      let localImagePath = null;

      // Check which extension actually exists
      for (const ext of possibleExtensions) {
        const filePath = path.join(imageDir, `${service.slug}${ext}`);
        if (fs.existsSync(filePath)) {
          localImagePath = `/images/ServiceImages/${service.slug}${ext}`;
          break;
        }
      }

      // Use local path if available, else fallback to DB image
      return {
        ...service._doc,
        displayImage: localImagePath || service.heroImage
      };
    });

    res.render('services', { services: updatedServices });
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).send('Server Error');
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
