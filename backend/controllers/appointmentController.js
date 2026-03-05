const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const Dentist = require("../models/Dentist");
const Treatment = require("../models/Treatment");
const User = require("../models/User");

exports.createAppointment = async (req, res) => {
    try {
        const { date, time, dentist, treatment, patient, appointmentComplete } = req.body;

        if (!date || !time || !dentist || !treatment || !patient) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const appointment = await Appointment.create({
            date, time, dentist, treatment, patient, appointmentComplete: Boolean(appointmentComplete)
        });

        return res.status(201).json({ message: "Appointment created", appointment });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate("dentist", "firstName lastName")
            .populate("treatment", "type price")
            .populate("patient", "firstName lastName");
        return res.status(200).json({ count: appointments.length, appointments });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });
        const appointment = await Appointment.findById(id)
            .populate("dentist", "firstName lastName")
            .populate("treatment", "type price")
            .populate("patient", "firstName lastName");
        if (!appointment) return res.status(404).json({ message: "Not found" });
        return res.status(200).json(appointment);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

        const allowedFields = ["date", "time", "dentist", "treatment", "patient", "appointmentComplete"];
        const updates = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        const updated = await Appointment.findByIdAndUpdate(id, updates, { new: true })
            .populate("dentist", "firstName lastName")
            .populate("treatment", "type price")
            .populate("patient", "firstName lastName");

        if (!updated) return res.status(404).json({ message: "Not found" });
        return res.status(200).json({ message: "Updated", appointment: updated });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });
        const deleted = await Appointment.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Not found" });
        return res.status(200).json({ message: "Deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
