const mongoose = require("mongoose");

const repairShopSchema = mongoose.Schema(
  {
    companyName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const RepairShop = mongoose.model("RepairShop", repairShopSchema);
module.exports = RepairShop;
