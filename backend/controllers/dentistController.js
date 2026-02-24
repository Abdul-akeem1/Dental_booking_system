const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Dentist = require("../models/Dentist");

// 201 create success
// 200 read/update/delete success
// 400 bad input / invalid id
// 404 not found
// 500 server error

// // --------------------------CREATE DENTIST------------------------------
// exports.createDentist = async (req, res) => {
//     try {
//         const { name, email, password, speciality } = req.body;
//     }
// }

// --------------------------DELETE DENTIST------------------------------
// validate ObjectId, delete by Id, return 404 if not found
exports.deleteDentist = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const deletedDentist = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}
