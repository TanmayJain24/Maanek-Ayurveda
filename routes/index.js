var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const Service = require("../models/service");
const Blog = require('../models/blog');


/* Home page. */
router.get("/", async (req, res) => {
  try {
    const services = await Service.find().limit(6); // Show top 6 services
    const blogs = await Blog.find().limit(6); // Show latest 6 blogs
    res.render("index", { services, blogs });
  } catch (err) {
    console.error("Error fetching home data:", err);
    res.status(500).send("Internal Server Error");
  }
});


/* About Us */
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});


/* Services */
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.render("services", { services });
  } catch (err) {
    console.error("Error loading services:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/services/:slug", async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) {
      return res.status(404).render("404", { message: "Service not found" });
    }
    res.render("dynamic-service", { service });
  } catch (err) {
    console.error("Error loading service:", err);
    res.status(500).send("Internal Server Error");
  }
});


/* Blogs */
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.render('blogs', { blogs });
  } catch (err) {
    console.error('Failed to load blogs:', err);
    res.status(500).send('Internal Server Error');
  }
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