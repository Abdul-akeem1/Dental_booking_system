const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  //appointmentComplete: { type: Boolean, default: false },
  date: { type: String, required: true },
  time: { type: String, required: true },
  dentist: { type: mongoose.Schema.Types.ObjectId, ref: "Dentist", required: true },
  treatment: { type: mongoose.Schema.Types.ObjectId, ref: "Treatment" },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  attended: { type: Boolean, default: false },
  paymentStatus: { type: String, default: 'unpaid' },
  discount: { type: Number }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
