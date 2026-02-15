require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 5000;
// Connect to MongoDB
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/dental_system";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  street: { type: String, required: true },
  town: { type: String, required: true },
  county: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Dentist Schema
const dentistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  speciality: { type: String, required: true },
});

const Dentist = mongoose.model("Dentist", dentistSchema);

// Treatment Schema
const treatmentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  dateIssued: { type: Date, default: Date.now },
  cost: { type: Number, required: true}
});

const Treatment = mongoose.model("Treatment", treatmentSchema);

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  appointmentComplete: { type: Boolean, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  employeeID: { type: mongoose.Schema.Types.ObjectId, ref: "Dentist", required: true },
  treatmentID: { type: mongoose.Schema.Types.ObjectId, ref: "Treatment", required: true },
  clientID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(
  session({
    secret: "secret-key", // Change this in production
    resave: false,
    saveUninitialized: true,
  }),
);

// User Register
app.post("/api/register", async (req, res) => { 
  const { name, phone, email, street, town, county, password } = req.body;
  if ( !name || !phone || !email || !street || !town || !county || !password)
    return res.status(400).json({ message: "All fields required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name,
      phone,
      email, 
      street, 
      town,
      county,
      password: hashedPassword 
    });
    await newUser.save();

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
   
  if (!email || !password)
    return res.status(400).json({message: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    req.session.userId = user._id; // Use standard _id from MongoDB
    // return user data
    res.json({ 
      message: "Login successful",
      userId: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Dentist Registration (for now anyone can be a dentist, i'll add security check later so admins can only create dentist accs.)
app.post("/api/dentist/register", async (req, res) => {
  const { name, email, password, speciality } = req.body;

  if (!name || !email || !password || !speciality)
    return res.status(400).json({ message: "All fields required" });

  try {
    const existingDentist = await Dentist.findOne({ email });
    if (existingDentist) {
      return res.status(400).json({ message: "Dentist already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDentist = new Dentist({ name, email, password: hashedPassword, speciality });
    await newDentist.save();
    res.status(201).json({ message: "Dentist created", dentistId: newDentist.id });
  } catch (error) {
    console.error("Dentist registration error: ", error);
    res.status(500).json({ message: "Server error" });
  }
  

});

// Dentist Login
app.post("/api/dentist/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({message: "Email and password required" });

  try {
    const dentist = await Dentist.findOne({ email });
    if (!dentist) return res.status(400).json({ message: "Dentist not found" });

    const match = await bcrypt.compare(password, dentist.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    req.session.dentistId = dentist._id;

    res.json({
      message: "Dentist login successful",
      dentistId: dentist._id,
      name: dentist.name,
      email: dentist.email,
      speciality: dentist.speciality
    })
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Admin Login Route
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({ message: "Admin login successful" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
