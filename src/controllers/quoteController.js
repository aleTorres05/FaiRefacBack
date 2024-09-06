const Quote = require("../models/Quote");

// Crear nueva cotización
const createQuote = async (req, res) => {
  const { carPart, amount, id_client, id_car, id_mechanic, id_repairShop } =
    req.body;

  const quote = new Quote({
    carPart,
    amount,
    id_client,
    id_car,
    id_mechanic,
    id_repairShop,
  });

  await quote.save();
  res.status(201).json(quote);
};

module.exports = { createQuote };
