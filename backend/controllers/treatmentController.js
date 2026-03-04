const mongoose = require("mongoose");
const Treatment = require("../models/Treatment");

// ------------------------CREATE TREATMENT---------------------------
exports.createTreatment = async (req, res) => {
  try {
    const { type, price, lengthMins } = req.body;

    if (!type || price === undefined || lengthMins === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const treatment = await Treatment.create({
      type,
      price,
      lengthMins,
    });

    return res.status(201).json({
      message: "Treatment created successfully",
      treatment,
    });

  } catch (err) {
    console.error("Create treatment error: ", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------------GET ALL TREATMENTS--------------------------
exports.getAllTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.find({});

    return res.status(200).json({
      count: treatments.length,
      treatments,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" })
  }
};

// -------------------------GET TREATMENT BY ID------------------------------
exports.getTreatmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid treatment id" });
    }

    const treatment = await Treatment.findById(id);

    if (!treatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }

    return res.status(200).json(treatment);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------------UPDATE TREATMENT------------------------------
exports.updateTreatment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid treatment id" });
    }

    const allowedFields = ["type", "price", "lengthMins"];
    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedTreatment = await Treatment.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTreatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }

    return res.status(200).json({
      message: "Treatment updated successfully",
      treatment: updatedTreatment,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// --------------------------DELETE TREATMENT------------------------------
exports.deleteTreatment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid treatment id" });
    }

    const deletedTreatment = await Treatment.findByIdAndDelete(id);

    if (!deletedTreatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }

    return res.status(200).json({ message: "Treatment deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
