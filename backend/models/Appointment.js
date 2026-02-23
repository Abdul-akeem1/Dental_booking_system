const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  appointmentComplete: { type: Boolean, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  employeeID: { type: mongoose.Schema.Types.ObjectId, ref: "Dentist", required: true },
  treatmentID: { type: mongoose.Schema.Types.ObjectId, ref: "Treatment", required: true },
  clientID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
