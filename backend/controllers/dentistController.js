const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Dentist = require("../models/Dentist");

// 201 create success
// 200 read/update/delete success
// 400 bad input / invalid id
// 404 not found
// 500 server error

// --------------------------CREATE DENTIST------------------------------
exports.createDentist = async (req, res) => {
    try {
        const { firstName, lastName, DOB, phone, email, password, speciality } = req.body;

        if (!firstName || !lastName || !email || !password || !speciality) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingDentist = await Dentist.findOne({ email });
        if (existingDentist) {
            return res.status(400).json({ message: "Dentist email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const dentist = await Dentist.create({
            firstName,
            lastName,
            DOB,
            phone,
            email,
            password: hashedPassword,
            speciality
        });

        const dentistResponse = dentist.toObject();
        delete dentistResponse.password;

        return res.status(201).json({
            message: "Dentist created successfully",
            dentist: dentistResponse,
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

// -------------------------UPDATE DENTIST------------------------------
exports.updateDentist = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid dentist id" });
        }

        const allowedFields = ["firstName", "lastName", "DOB", "phone", "email", "password", "speciality"];
        const updates = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const updatedDentist = await Dentist.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!updatedDentist) {
            return res.status(404).json({ message: "Dentist not found" });
        }

        return res.status(200).json({
            message: "Dentist updated successfully",
            dentist: updatedDentist,
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};// -------------------------GET ALL DENTIST--------------------------
exports.getAllDentists = async (req, res) => {
    try {
        const dentists = await Dentist.find({})
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: dentists.length,
            dentists,
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" })
    }
}


// -------------------------GET DENTIST BY ID------------------------------
exports.getDentistById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const dentist = await Dentist.findById(id).select("-password");

        if (!dentist) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(dentist);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}


// --------------------------DELETE DENTIST------------------------------
// validate ObjectId, delete by Id, return 404 if not found
exports.deleteDentist = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid dentist id" });
        }

        const deletedDentist = await Dentist.findByIdAndDelete(id);

        if (!deletedDentist) {
            return res.status(404).json({ message: "Dentist not found" });
        }

        return res.status(200).json({ message: "Dentist deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}
