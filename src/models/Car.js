const mongoose = require("mongoose");

const carSchema = mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    version: { type: String, required: true },
    year: { type: Number, required: true },
    nickname: { type: String },
    id_photo: { type: String },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
module.exports = Car;
