const RepairShop = require("../models/RepairShop");

const getRepairShopProfile = async (req, res) => {
  try {
    const repairShop = await RepairShop.findById(req.params.id);

    if (!repairShop) {
      return res.status(404).json({ message: "Repair shop not found" });
    }

    res.json(repairShop);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving repair shop profile" });
  }
};

module.exports = { getRepairShopProfile };
