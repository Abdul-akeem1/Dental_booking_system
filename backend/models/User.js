const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: Object.keys(mongoose.Schema.Types).includes("String") ? String : mongoose.Schema.Types.String,
  lastName: String,
  DOB: Date,
  phone: String,
  email: { type: String, required: true, unique: true },
  street: String,
  town: String,
  county: String,
  country: String,
  Eircode: String,
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);