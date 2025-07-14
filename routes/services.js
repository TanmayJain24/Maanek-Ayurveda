const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// File path
const servicesPath = path.join(__dirname, '../data/services.json');
let services = [];

// Function to load services
function loadServices() {
  try {
    const data = fs.readFileSync(servicesPath, 'utf-8');
    services = JSON.parse(data);
  } catch (err) {
    console.error('Failed to read services.json:', err.message);
    services = [];
  }
}

// Initial load
loadServices();

// Dynamic route
router.get('/:slug', (req, res) => {
  const service = services.find(s => s.slug === req.params.slug);
  if (!service) {
    return res.status(404).render('error', { message: 'Service Not Found' });
  }

  res.render('dynamic-service', { service });
});

module.exports = router;