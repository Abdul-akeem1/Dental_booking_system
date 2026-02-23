const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  dateIssued: { type: Date, default: Date.now },
  cost: { type: Number, required: true}
});

module.exports = mongoose.model("Treatment", treatmentSchema);