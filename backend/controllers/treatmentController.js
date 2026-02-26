const mongoose = require("mongoose");
const Treatment = require("../models/Treatment");

// 201 create success
// 200 read/update/delete success
// 400 bad input / invalid id
// 404 not found
// 500 server error

// ------------------------CREATE TREATMENT---------------------------
exports.createTreatment = async (req, res) => {
  try {
    const { userId, amount, dateIssued, cost } = req.body
  
    // required fields
    if (!userId || amount === undefined || !dateIssued || cost === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    // check user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" })l
    }

    // create treatment
    const treatment = await Treatment.create({
      user: userId,
      amount,
      dateIssued,
      cost,
    });

    return res.status(201).json({
      messsage: "Treatment created successfully",
      treatment,
    });
  
  } catch (err) {
    console.error("Create treatment error: ", err);
    return res.status(500).json({ message: "Server error" });
  } 
}
