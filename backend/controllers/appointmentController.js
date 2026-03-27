const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const Dentist = require("../models/Dentist");
const Treatment = require("../models/Treatment");
const User = require("../models/User");


// ------------------------------CREATE APPOINTMENT---------------------------------
exports.createAppointment = async (req, res) => {
    try {
        const { date, time, dentist, treatment, patient, attended } = req.body;

        if (!date || !time || !dentist || !treatment || !patient) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        //only allow dates after today
        const appointmentDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (appointmentDate < today) {
            return res.status(400).json({ message: "Appointment date must be today or in the future" });
        }

        //prevent double booking
        const existingAppointment = await Appointment.findOne({ dentist, date, time });
        if (existingAppointment) {
            return res.status(400).json({ message: "This time slot is already booked" });
        }

        const appointment = await Appointment.create({
            date, time, dentist, treatment, patient, attended: Boolean(attended)
        });

        /* // Populate patient, dentist, and treatment to send a comprehensive email
        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate("patient", "firstName lastName email")
            .populate("dentist", "firstName lastName")
            .populate("treatment", "type price");

         // Send confirmation email to the patient
        if (populatedAppointment.patient && populatedAppointment.patient.email) {
            const message = `Dear ${populatedAppointment.patient.firstName},\n\nYour appointment has been successfully booked.\n\nDetails:\nDate: ${date}\nTime: ${time}\nDentist: Dr. ${populatedAppointment.dentist.firstName} ${populatedAppointment.dentist.lastName}\nTreatment: ${populatedAppointment.treatment.type}\n\nThank you for choosing our clinic!`;
            
            try {
                // Ensure nodemailer doesn't crash the appointment creation if it fails
                const sendEmail = require("../utils/sendEmail");
                await sendEmail({
                    email: populatedAppointment.patient.email,
                    subject: "Appointment Confirmation",
                    message,
                });
            } catch (emailError) {
                console.error("Error sending confirmation email:", emailError);
            }
        }*/

        return res.status(201).json({ message: "Appointment created", appointment });
    } catch (err) {
        console.error("Error creating appointment:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


// ------------------------------GET ALL APPOINTMENTS---------------------------------
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

// ------------------------------GET APPOINTMENTS BY ID---------------------------------
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

// ------------------------------UPDATE APPOINTMENT--------------------------------
exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

        const existingAppt = await Appointment.findById(id);
        if (!existingAppt) return res.status(404).json({ message: "Not found" });


        const allowedFields = ["date", "time", "dentist", "treatment", "patient", "attended", "paymentStatus", "discount"];
        const updates = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        // Only block past dates if the date is explicitly being CHANGED to a new past date
        if (updates.date && updates.date !== existingAppt.date) {
            const appointmentDate = new Date(updates.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (appointmentDate < today) {
                return res.status(400).json({ message: "Appointment date must be today or in the future" });
            }
        }

        // Prevent double booking for the same dentist at the same date and time
        if (updates.date || updates.time || updates.dentist) {
            const doubleBooking = await Appointment.findOne({
                dentist: updates.dentist || existingAppt.dentist,
                date: updates.date || existingAppt.date,
                time: updates.time || existingAppt.time,
                _id: { $ne: id }
            });

            if (doubleBooking) {
                return res.status(400).json({ message: "This time slot is already booked" })
            }
        }

        //update appointment
        const updated = await Appointment.findByIdAndUpdate(id, updates, { new: true })
            .populate("dentist", "firstName lastName")
            .populate("treatment", "type price")
            .populate("patient", "firstName lastName");

        return res.status(200).json({ message: "Updated", appointment: updated });
    } catch (err) {
        console.error("Update Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// ------------------------------DELETE APPOINTMENT---------------------------------
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
