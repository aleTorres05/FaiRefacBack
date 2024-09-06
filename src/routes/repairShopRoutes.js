const express = require("express");
const { getRepairShopProfile } = require("../controllers/repairShopController");
const router = express.Router();

router.get("/:id", getRepairShopProfile);

module.exports = router;
