const express = require("express");
const router = express.Router();
const dentistController = require("../controllers/dentistController");

router.delete("/:id", userController.deleteUser);

module.exports = router;