var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

/* Home page. */
router.get('/', (req, res, next) => {
  const servicesPath = path.join(__dirname, '../data/services.json');
  const blogsPath = path.join(__dirname, '../data/blogs.json');

  try {
    const services = JSON.parse(fs.readFileSync(servicesPath, 'utf-8'));
    const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf-8'));

    res.render('index', {
      services,
      blogs
    });

  } catch (err) {
    console.error('Error loading home data:', err);
    res.status(500).send('Internal Server Error');
  }
});


/* About Us */
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

/* Services */
router.get('/services', (req, res) => {
  const servicesPath = path.join(__dirname, '../data/services.json');
  fs.readFile(servicesPath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Failed to load services:', err);
      return res.status(500).send('Internal Server Error');
    }

    const services = JSON.parse(data);
    res.render('services', { title: 'Our Services', services });
  });
});


/* Blogs */
router.get('/blogs', (req, res) => {
  const blogsPath = path.join(__dirname, '../data/blogs.json');
  fs.readFile(blogsPath, 'utf-8', (err, data) => {
      if (err) {
          console.error('Failed to load blogs:', err);
          return res.status(500).send('Internal Server Error');
      }

      const blogs = JSON.parse(data);
      res.render('blogs', { blogs });
  });
});

/* Contact */
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

/* consultaion */
router.get('/consultation', (req, res) => {
  res.render('consultation', { title: 'Consultation' });
});

module.exports = router;