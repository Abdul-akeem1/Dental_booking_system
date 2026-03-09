const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// 201 create success
// 200 read/update/delete success
// 400 bad input / invalid id
// 404 not found
// 500 server error


// --------------------------LOGIN USER------------------------------
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


// --------------------------CREATE USER------------------------------
// validate email + password, check duplicate email, 
// hash password, create user, and return user without password 
exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, DOB, phone, email, street, town, county, country, Eircode, password } = req.body;

        // 1) required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const normalisedEmail = email.trim().toLowerCase();

        // 2) duplicate email check
        const existingUser = await User.findOne({ email: normalisedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // 3) hash password
        const hashedPassword = await bcrypt.hash(password, 10);


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
            Eircode,
            password: hashedPassword,
        });

        // 5) return without password
        const userResponse = user.toObject();
        delete userResponse.password;

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
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: users.length,
            users,
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

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const allowedFields = ["firstName", "lastName", "DOB", "phone", "email", "street", "town", "county", "country", "Eircode", "password"];
        const updates = {};

        for (const key of allowedFields) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        if (updates.email) {
            updates.email = updates.email.trim().toLowerCase();

            const emailOwner = await User.findOne({ email: updates.email });
            if (emailOwner && emailOwner._id.toString() !== id) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");

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