const Mechanic = require("../models/Mechanic");

const getMechanicProfile = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id);

    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    res.json(mechanic);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving mechanic profile" });
  }
};

module.exports = { getMechanicProfile };
