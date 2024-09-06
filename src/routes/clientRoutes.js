const express = require("express");
const { getClientProfile } = require("../controllers/clientController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/profile", protect, getClientProfile);

module.exports = router;
