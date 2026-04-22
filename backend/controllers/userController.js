const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// 201 create success
// 200 read/update/delete success
// 400 bad input / invalid id
// 404 not found
// 500 server error


// --------------------------LOGIN USER------------------------------
/*
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    try {
        const normalisedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalisedEmail });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        req.session.userId = user._id;

        return res.status(200).json({
            message: "Login successful",
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
*/


// --------------------------CREATE USER------------------------------
// validate email + password, check duplicate email, 
// hash password, create user, and return user without password 
exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, DOB, phone, email, street, town, county, country, Eircode } = req.body;

        // 1) required fields
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const normalisedEmail = email.trim().toLowerCase();

        // 2) duplicate email check
        const existingUser = await User.findOne({ email: normalisedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }


        //Validations
        //validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(normalisedEmail)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        //validate phone number (Irish format)
        const phoneRegex = /^08[0-9]{8}$/;
        if(phone && !phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number" });
        }

        //validate DOB (must be atleast 18)
        const dobDate = new Date(DOB);
        const today = new Date();

        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }

        if (age > 120) {
            return res.status(400).json({ message: "Invalid date of birth" });
        }

        if (dobDate > today) {
            return res.status(400).json({ message: "DOB cannot be in the future." });
        }

        //validate address fields
        const textRegex = /^[A-Za-z\s'-]{2,50}$/;

        if (town && !textRegex.test(town)) {
            return res.status(400).json({ message: "Invalid town name" });
        }

        if (county && !textRegex.test(county)) {
            return res.status(400).json({ message: "Invalid county name" });
        }

        if (country && !textRegex.test(country)) {
            return res.status(400).json({ message: "Invalid country name" });
        }

        //validate eircode
        const eircodeRegex = /^[A-Za-z0-9]{3}\s?[A-Za-z0-9]{4}$/;

        if (!eircodeRegex.test(Eircode)) {
            return res.status(400).json({ message: "Invalid Eircode format" });
        }


        // 4) create user (only allowed fields)
        const user = await User.create({
            firstName,
            lastName,
            DOB,
            phone,
            email: normalisedEmail,
            street,
            town,
            county,
            country,
            Eircode
        });

        const userResponse = user.toObject();

        return res.status(201).json({
            message: "User created successfully",
            user: userResponse,
        });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}


// --------------------------GET ALL USERS------------------------------
// fetch all users, exclude password, sort by createdAt desc.
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .sort({ createdAt: -1 })
            .lean();

        const Appointment = require("../models/Appointment");
        const appointments = await Appointment.find({}).populate("treatment", "price");

        const usersWithOwed = users.map(user => {
            const userAppointments = appointments.filter(a => a.patient && a.patient.toString() === user._id.toString());
            const amountOwed = userAppointments.reduce((sum, appt) => {
                if (appt.treatment && appt.treatment.price) {
                    return sum + appt.treatment.price;
                }
                return sum;
            }, 0);
            return { ...user, amountOwed };
        });

        return res.status(200).json({
            count: usersWithOwed.length,
            users: usersWithOwed,
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}


// --------------------------GET USER BY ID------------------------------
// validate ObjectId first, find by id, return 404 if missing, exclude password
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const user = await User.findById(id).lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const Appointment = require("../models/Appointment");
        const appointments = await Appointment.find({ patient: id }).populate("treatment", "price");
        const amountOwed = appointments.reduce((sum, appt) => {
            if (appt.treatment && appt.treatment.price) {
                return sum + appt.treatment.price;
            }
            return sum;
        }, 0);

        user.amountOwed = amountOwed;

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}



// --------------------------UPDATE USER------------------------------
// validate ObjectId, allow only editable fields (name, phone, email, etc.),
// hash if password is updated, handle duplicate email
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        //validate user ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        //prepare allowed fields
        const allowedFields = ["firstName", "lastName", "DOB", "phone", "email", "street", "town", "county", "country", "Eircode"];
        const updates = {};

        for (const key of allowedFields) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        //email validation and duplicate check
        if (updates.email) {
            updates.email = updates.email.trim().toLowerCase();

            const emailOwner = await User.findOne({ email: updates.email });
            if (emailOwner && emailOwner._id.toString() !== id) {
                return res.status(400).json({ message: "Email already in use" });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(updates.email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
        }


        //phone validation
        if (updates.phone) {
            const phoneRegex = /^08[0-9]{8}$/;
            if(updates.phone && !phoneRegex.test(updates.phone)) {
                return res.status(400).json({ message: "Invalid phone number" });
            }
        }

        //DOB validation
        if (updates.DOB) {
            const dobDate = new Date(updates.DOB);
            const today = new Date();

            let age = today.getFullYear() - dobDate.getFullYear();
            const monthDiff = today.getMonth() - dobDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
                age--;
            }

            if (age > 120) {
                return res.status(400).json({ message: "Invalid date of birth" });
            }

            if (dobDate > today) {
                return res.status(400).json({ message: "DOB cannot be in the future." });
            }
        }

        //adress validation
        const textRegex = /^[A-Za-z\s'-]{2,50}$/;

        if (updates.town && !textRegex.test(updates.town)) {
            return res.status(400).json({ message: "Invalid town name" });
        }

        if (updates.county && !textRegex.test(updates.county)) {
            return res.status(400).json({ message: "Invalid county name" });
        }

        if (updates.country && !textRegex.test(updates.country)) {
            return res.status(400).json({ message: "Invalid country name" });
        }

        //eircode validation
        if (updates.Eircode) {
            const eircodeRegex = /^[A-Za-z0-9]{3}\s?[A-Za-z0-9]{4}$/;

            if (!eircodeRegex.test(updates.Eircode)) {
                return res.status(400).json({ message: "Invalid Eircode format" });
            }
        }

        //update user
        const updatedUser = await User.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        return res.status(200).json({
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}



// --------------------------DELETE USER------------------------------
// validate ObjectId, delete by Id, return 404 if not found
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}