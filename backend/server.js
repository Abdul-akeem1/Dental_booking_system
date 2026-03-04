require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");

// route modules
const userRoutes = require("./routes/userRoutes");
const dentistRoutes = require("./routes/dentistRoutes");
const treatmentRoutes = require("./routes/treatmentRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

// app setup
const app = express();
const PORT = process.env.PORT || 5000;

// database connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/dental_system";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// global middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: true,
  }),
);

// api route mounting
app.use("/api/users", userRoutes);
app.use("/api/dentists", dentistRoutes);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/appointments", appointmentRoutes);

// -----------------------------------------------------------------------------
// commented out (kept for reference incase)
// -----------------------------------------------------------------------------

// Dentist Registration (disabled)
// app.post("/api/dentist/register", async (req, res) => {
//   const { name, email, password, speciality } = req.body;

//   if (!name || !email || !password || !speciality) {
//     return res.status(400).json({ message: "All fields required." });
//   }

//   try {
//     const existingDentist = await Dentist.findOne({ email });
//     if (existingDentist) {
//       return res.status(400).json({ message: "Dentist already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newDentist = new Dentist({ name, email, password: hashedPassword, speciality });
//     await newDentist.save();

//     res.status(201).json({ message: "Dentist created", dentistId: newDentist.id });
//   } catch (error) {
//     console.error("Dentist registration error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// Dentist Login (disabled)
// app.post("/api/dentist/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password required" });
//   }

//   try {
//     const dentist = await Dentist.findOne({ email });
//     if (!dentist) {
//       return res.status(400).json({ message: "Dentist not found" });
//     }

//     const match = await bcrypt.compare(password, dentist.password);
//     if (!match) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     req.session.dentistId = dentist._id;
//     res.json({
//       message: "Dentist login successful",
//       dentistId: dentist._id,
//       name: dentist.name,
//       email: dentist.email,
//       speciality: dentist.speciality,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// Treatment Creation (disabled)
// app.post("/api/treatment/create", async (req, res) => {
//   const { amount, cost } = req.body;

//   if (!amount || !cost) {
//     return res.status(400).json({ message: "Amount and cost required" });
//   }

//   if (typeof amount !== "number" || typeof cost !== "number") {
//     return res.status(400).json({ message: "Amount and cost must be numbers" });
//   }

//   try {
//     const newTreatment = new Treatment({ amount, cost });
//     await newTreatment.save();
//     res.status(201).json({
//       message: "Treatment created",
//       treatmentId: newTreatment._id,
//     });
//   } catch (error) {
//     console.error("Treatment creation error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// Appointment Creation (disabled)
// app.post("/api/appointment/create", async (req, res) => {
//   const { date, time, employeeID, treatmentID, clientID, appointmentComplete } = req.body;

//   if (!date || !time || !employeeID || !treatmentID || !clientID) {
//     return res.status(400).json({
//       message: "date, time, employeeID, treatmentID, and clientID are required",
//     });
//   }

//   const parsedDate = new Date(date);
//   if (Number.isNaN(parsedDate.getTime())) {
//     return res.status(400).json({ message: "Invalid date format" });
//   }

//   if (
//     !mongoose.Types.ObjectId.isValid(employeeID) ||
//     !mongoose.Types.ObjectId.isValid(treatmentID) ||
//     !mongoose.Types.ObjectId.isValid(clientID)
//   ) {
//     return res.status(400).json({ message: "Invalid ID format" });
//   }

//   try {
//     const [dentist, treatment, user] = await Promise.all([
//       Dentist.findById(employeeID),
//       Treatment.findById(treatmentID),
//       User.findById(clientID),
//     ]);

//     if (!dentist) return res.status(404).json({ message: "Dentist not found" });
//     if (!treatment) return res.status(404).json({ message: "Treatment not found" });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const newAppointment = new Appointment({
//       appointmentComplete: Boolean(appointmentComplete ?? false),
//       date: parsedDate,
//       time,
//       employeeID,
//       treatmentID,
//       clientID,
//     });

//     await newAppointment.save();

//     return res.status(201).json({
//       message: "Appointment created",
//       appointmentId: newAppointment._id,
//     });
//   } catch (error) {
//     console.error("Appointment creation error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    return res.json({ message: "Admin login successful" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

// health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
