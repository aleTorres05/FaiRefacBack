const mongoose = require("mongoose");

const mechanicSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    workshopName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  { timestamps: true }
);

const Mechanic = mongoose.model("Mechanic", mechanicSchema);
module.exports = Mechanic;
