const createError = require("http-errors");
const Client = require("../models/client.model");
const RepairShopQuote = require("../models/repairShopQuote.model");
const Quote = require("../models/quote.model");
const { calculateTotalById } = require("../usecases/quote.usecase");
const { sendRepairShopQuoteNotification } = require("../lib/emailService");
const { default: mongoose } = require("mongoose");

async function updateById(id, repairShopId, updatedItems) {
  if (!Array.isArray(updatedItems)) {
    throw createError(400, "Invalid input. Expected an array of items.");
  }

  updatedItems.forEach((item) => {
    if (!item.unitPrice || !item.brand || !item._id) {
      throw createError(
        400,
        "Missing data in updated items. Each item must have '_id', 'unitPrice', and 'brand'."
      );
    }
    if (typeof item.unitPrice !== "number") {
      throw createError(
        400,
        "Invalid data type. 'unitPrice' must be a number."
      );
    }
    if (typeof item.brand !== "string") {
      throw createError(400, "Invalid data type. 'brand' must be a string.");
    }
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!id || !repairShopId || !updatedItems || updatedItems.length === 0) {
      throw createError(400, "Missing required data to update the quote.");
    }

    const repairShopQuote = await RepairShopQuote.findById(id);

    if (!repairShopQuote) {
      throw createError(404, "Quote not found.");
    }

    if (repairShopQuote.status !== "initial") {
      throw createError(400, "This quote was already updated.");
    }

    if (!repairShopQuote.repairShop.equals(repairShopId)) {
      throw createError(403, "Unauthorized to update this info.");
    }

    const quote = await Quote.findOne({ repairShopQuotes: id });
    if (!quote) {
      throw createError(404, "Quote not found.");
    }

    let totalPrice = 0;
    repairShopQuote.items = repairShopQuote.items.map((item) => {
      const updatedItem = updatedItems.find(
        (i) => i._id === item._id.toString()
      );

      if (!updatedItem) {
        throw createError(405, "Item does not belong to the quote.");
      }

      if (updatedItem) {
        item.unitPrice = updatedItem.unitPrice;
        item.quantity = updatedItem.quantity || item.quantity;
        item.brand = updatedItem.brand;

        item.itemTotalPrice = item.unitPrice * item.quantity;
      }

      totalPrice += item.itemTotalPrice;
      return item;
    });

    repairShopQuote.totalPrice = totalPrice;
    repairShopQuote.status = "review";

    await repairShopQuote.save({ session });

    const client = await Client.findOne({ cars: repairShopQuote.car });

    if (client) {
      await sendRepairShopQuoteNotification(client);
    }

    await session.commitTransaction();

    return repairShopQuote;
  } catch (error) {
    await session.abortTransaction();
    throw createError(500, error);
  } finally {
    const quote = await Quote.findOne({ repairShopQuotes: id });
    if (quote) {
      await calculateTotalById(quote._id);
    }

    session.endSession();
  }
}

async function getById(id, user) {
  if (!id) {
    throw createError(400, "Missing required data to get the info");
  }

  if (
    (user.isClient && !user.client) ||
    (user.isRepairShop && !user.repairShop)
  ) {
    throw createError(
      403,
      "User does not have the necessary info to get this quote."
    );
  }

  const repairShopQuote = await RepairShopQuote.findById(id)
    .populate("car")
    .populate("mechanic")
    .populate("repairShop");

  if (!repairShopQuote) {
    throw createError(404, "Quote not found.");
  }

  if (!repairShopQuote.car) {
    throw createError(400, "No car associated with this quote.");
  }
  if (!repairShopQuote.repairShop) {
    throw createError(400, "No repair shop associated with this quote.");
  }

  const quotedCarId = repairShopQuote.car?._id.toString();
  const repairShopId = repairShopQuote.repairShop?._id.toString();

  if (
    user.isClient &&
    !user.client.cars.some((carId) => carId.toString() === quotedCarId)
  ) {
    throw createError(403, "You are not authorized to view this quote.");
  }

  if (user.isRepairShop && user.repairShop._id.toString() !== repairShopId) {
    throw createError(403, "You are not authorized to view this quote.");
  }

  return repairShopQuote;
}

async function deleteItemById(id, clientId, itemId) {
  if (!id || !clientId || itemId) {
    createError(400, "Missing require data to delete the item.");
  }
  const client = await Client.findById(clientId);
  if (!client) {
    throw createError(404, "Client not found.");
  }
  const repairShopQuote = await RepairShopQuote.findById(id);
  if (!repairShopQuote) {
    throw createError(404, "Repair shop quote not found.");
  }

  const quote = await Quote.findOne({ repairShopQuotes: id });
  if (!quote) {
    throw createError(404, "Quote not found.");
  }

  const isCarInClient = client.cars.some(
    (carId) => carId.toString() === repairShopQuote.car.toString()
  );
  if (!isCarInClient) {
    throw createError(403, "Unauthorized to update this quote.");
  }

  const itemExists = repairShopQuote.items.some(
    (item) => item._id.toString() === itemId
  );
  if (!itemExists) {
    throw createError(404, "Item not found in the repairShopQuote.");
  }

  const updateRepairShopQuote = await RepairShopQuote.findByIdAndUpdate(
    id,
    {
      $pull: { items: { _id: new mongoose.Types.ObjectId(itemId) } },
    },
    { new: true }
  );

  if (!updateRepairShopQuote) {
    throw createError(405, "Item does not belong to the quote.");
  }

  const newTotalPrice = updateRepairShopQuote.items.reduce((total, item) => {
    return total + (item.itemTotalPrice || 0);
  }, 0);

  updateRepairShopQuote.totalPrice = newTotalPrice;
  await updateRepairShopQuote.save();

  const calculateTotal = await calculateTotalById(quote._id);

  return updateRepairShopQuote;
}

async function changeStatusById(id, repairShopId) {
  if (!id || !repairShopId) {
    throw createError(400, "Missing required data to change the status.");
  }

  try {
    const repairShopQuote = await RepairShopQuote.findById(id);

    if (!repairShopQuote) {
      throw createError(404, "Quote not found.");
    }

    if (!repairShopQuote.repairShop.equals(repairShopId)) {
      throw createError(403, "Unauthorized to update this quote.");
    }

    const nextState = {
      paid: "sent",
      sent: "delivered",
    };

    if (nextState[repairShopQuote.status]) {
      repairShopQuote.status = nextState[repairShopQuote.status];
      await repairShopQuote.save();
    } else {
      throw createError(403, "This quote is not available for status change.");
    }

    return repairShopQuote;
  } catch (error) {
    throw createError(500, error.message);
  }
}

module.exports = {
  updateById,
  getById,
  deleteItemById,
  changeStatusById,
};
