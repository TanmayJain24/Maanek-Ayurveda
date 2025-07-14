const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  // Personal Details
  fullName: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  dob: { type: Date },
  phone: { type: String, required: true },
  email: { type: String },
  occupation: { type: String },
  address: { type: String },
  maritalStatus: { type: String },
  children: { type: String },

  // Chief Complaints
  complaints: { type: String },
  duration: { type: String },

  // Medical History
  diseases: [{ type: String }],
  otherDiseases: { type: String },
  allergies: { type: String },
  surgery: { type: String },
  medications: { type: String },

  // Lifestyle Details
  sleep: { type: String },
  diet: { type: String },
  bowel: { type: String },
  appetite: { type: String },
  thirst: { type: String },
  activity: { type: String },

  // Menstrual History
  cycle: { type: String },
  menstrualDuration: { type: Number },
  pain: { type: String },
  menopause: { type: String },
  noOfChildren: { type: Number },

  //Appointment Details
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true
  },

  //Transaction Details
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  paymentScreenshot: {
    type: String, // will store file name
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});
consultationSchema.index({ appointmentDate: 1, appointmentTime: 1 }, { unique: true });

module.exports = mongoose.model('Consultation', consultationSchema);  