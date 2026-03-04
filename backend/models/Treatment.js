const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  lengthMins: { type: Number, required: true }
});

module.exports = mongoose.model("Treatment", treatmentSchema);
