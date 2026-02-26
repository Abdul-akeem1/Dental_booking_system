const express = require("express");
const router = express.Router();
const treatmentController = require("../controllers/treatmentController");

router.post("/", treatmentController.createTreatment);

module.exports = router;
