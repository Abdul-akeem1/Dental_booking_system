const express = require("express");
const router = express.Router();
const dentistController = require("../controllers/dentistController");

router.delete("/:id", dentistController.deleteDentist);
router.get("/", dentistController.getAllDentists);
router.get("/:id", dentistController.getDentistById);

module.exports = router;