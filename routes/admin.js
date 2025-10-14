const express = require("express");
const router = express.Router();
const Consultation = require("../models/Consultation");

// Admin dashboard route
router.get("/", async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ appointmentDate: -1, time: 1 });
    res.render("admin-dashboard", { title: "Admin Dashboard", consultations });
  } catch (err) {
    console.error("Error fetching consultations:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;