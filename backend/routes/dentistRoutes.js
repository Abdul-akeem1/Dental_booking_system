const express = require("express");
const router = express.Router();
const dentistController = require("../controllers/dentistController");

router.delete("/:id", dentistController.deleteDentist);

module.exports = router;