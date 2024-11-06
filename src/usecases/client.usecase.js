const createError = require("http-errors");
const Client = require("../models/client.model");
const Car = require("../models/car.model");
const uploadToS3 = require("../lib/aws");

async function associateCarWithClient(id, clientId, carData, file = null) {
  const client = await Client.findById(id);

  if (!client) {
    throw createError(404, "Client not found");
  }

  if (client._id.toString() !== clientId.toString()) {
    throw createError(403, "Unauthorized to update this info.");
  }

  const newCar = await Car.create(carData);

  if (file) {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const imageUrl = await uploadToS3(file, bucketName);
    newCar.carPicture = imageUrl;
    await newCar.save();
  }

  client.cars.push(newCar._id);

  await client.save();

  return client.populate("cars");
}

async function getById(id, clientId) {
  if (id.toString() !== clientId.toString()) {
    throw createError(
      403,
      "You are not authorized to access this client's information."
    );
  }

  const client = await Client.findById(id).populate({
    path: "cars",
    model: "Car",
    populate: [
      {
        path: "quotes",
        model: "Quote",
        populate: {
          path: "repairShopQuotes",
          model: "RepairShopQuote",
          populate: [
            { path: "car", model: "Car" },
            { path: "mechanic", model: "Mechanic" },
            { path: "repairShop", model: "RepairShop" },
          ],
        },
      },
    ],
  });

  if (!client) {
    throw createError(404, "Client not found");
  }

  return client;
}

module.exports = {
  associateCarWithClient,
  getById,
};
