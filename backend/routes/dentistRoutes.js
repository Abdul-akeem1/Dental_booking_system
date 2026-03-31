const express = require("express");
const router = express.Router();
const dentistController = require("../controllers/dentistController");

router.post("/login", dentistController.loginDentist);
router.post("/", dentistController.createDentist);
router.get("/", dentistController.getAllDentists);
router.get("/:id", dentistController.getDentistById);
router.put("/:id", dentistController.updateDentist);
router.delete("/:id", dentistController.deleteDentist);

module.exports = router;