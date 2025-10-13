const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  name: String, 
  phone: String,
  email: String,
  date: { type: String, required: true },
  time: { type: String, required: true },
});

appointmentSchema.index({ date: 1, time: 1 }, { unique: true }); // prevents duplicate bookings

module.exports = mongoose.model("Appointment", appointmentSchema);