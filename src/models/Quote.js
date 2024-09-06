const mongoose = require("mongoose");

const quoteSchema = mongoose.Schema(
  {
    carPart: { type: String, required: true },
    amount: { type: Number, required: true },
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    id_car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
    id_mechanic: { type: mongoose.Schema.Types.ObjectId, ref: "Mechanic" },
    id_repairShop: { type: mongoose.Schema.Types.ObjectId, ref: "RepairShop" },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Quote = mongoose.model("Quote", quoteSchema);
module.exports = Quote;
