const express = require("express");
const { getMechanicProfile } = require("../controllers/mechanicController");
const router = express.Router();

router.get("/:id", getMechanicProfile);

module.exports = router;
