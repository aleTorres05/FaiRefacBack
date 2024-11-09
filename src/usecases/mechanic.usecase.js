const createError = require("http-errors");
const Mechanic = require("../models/mechanic.model");

async function create(mechanicData) {
  const { firstName, lastName, workshopName, phoneNumber, address } =
    mechanicData;

  if (!firstName || !lastName || !workshopName || !phoneNumber || !address) {
    throw createError(400, "All fields are required");
  }

  const existingMechanic = await Mechanic.findOne({ phoneNumber });

  if (existingMechanic) {
    throw createError(409, " A mechanic with this phone number already exist");
  }

  const newMechanic = await Mechanic.create(mechanicData);
  return newMechanic;
}

async function getAll() {
  const allMechanics = await Mechanic.find();
  return allMechanics;
}

async function getById(id) {
  const mechanic = await Mechanic.findById(id);
  return mechanic;
}

module.exports = {
  create,
  getAll,
  getById,
};
