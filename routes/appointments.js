const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");

// 📅 Get all booked slots
router.get("/booked", async (req, res) => {
  try {
    const appointments = await Appointment.find({}, "date time -_id");
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching booked slots:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🧾 Book an appointment
router.post("/book", async (req, res) => {
  const { name, phone, date, time } = req.body;
  if (!date || !time) {
    return res.status(400).json({ message: "Please select date and time" });
  }

  try {
    // Check if slot already booked
    const exists = await Appointment.findOne({ date, time });
    if (exists) {
      return res.status(400).json({ message: "This slot is already booked ❌" });
    }

    // Save booking
    const newAppointment = new Appointment({ name, phone, date, time });
    await newAppointment.save();

    res.status(200).json({ message: "Appointment booked successfully ✅" });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;