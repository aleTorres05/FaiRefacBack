const Quote = require("../models/quote.model");
const Client = require("../models/client.model");
const RepairShopQuote = require("../models/repairShopQuote.model");
const Car = require("../models/car.model");
const RepairShop = require("../models/repairShop.model");
const Mechanic = require("../models/mechanic.model");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const createError = require("http-errors");
const createError = require("http-errors");
const Car = require("../models/car.model");
const jwt = require("../lib/jwt");
const encrypt = require("../lib/encrypt");

async function create(carId, mechanicId, items) {
  if (!carId || !mechanicId || !items || items.length === 0) {
    throw createError(400, "Missing required data to create the quote.");
  }

  const mechanic = await Mechanic.findById(mechanicId);
  if (!mechanic) {
    throw createError(404, "Mechanic not found.");
  }

  const car = await Car.findById(carId);
  if (!car) {
    throw createError(404, "Car not found.");
  }

  const repairShops = await RepairShop.find({
    "address.zipCode": mechanic.address.zipCode,
  });
  if (!repairShops.length) {
    throw createError(
      404,
      "No repair shops found for the mechanic's postal code."
    );
  }

  const newQuote = new Quote({
    items: items.map((item) => ({
      concept: item.concept,
      quantity: item.quantity,
    })),
    total: 0,
    status: "initial",
  });

  const savedQuote = await newQuote.save();

  car.quotes.push(savedQuote._id);
  await car.save();

  await Promise.all(
    repairShops.map(async (shop) => {
      shop.quotes = shop.quotes || [];
      const newRepairShopQuote = new RepairShopQuote({
        car: carId,
        mechanic: mechanicId,
        repairShop: shop._id,
        items: items.map((item) => ({
          concept: item.concept,
          quantity: item.quantity,
        })),
        totalPrice: 0,
        status: "initial",
      });

      const savedRepairShopQuote = await newRepairShopQuote.save();

      shop.quotes.push(savedRepairShopQuote._id);
      await shop.save();

      newQuote.repairShopQuotes.push(savedRepairShopQuote._id);
    })
  );

  await newQuote.save();

  return newQuote;
}

async function getById(id, clientId) {
  const car = await Car.findOne({ quotes: id });
  if (!car) {
    throw createError(404, "Car not found.");
  }

  const client = await Client.findOne({ cars: car._id });

  if (!client) {
    throw createError(404, "Client not found.");
  }

  if (client._id.toString() !== clientId.toString()) {
    throw createError(403, "Unauthorized to get this info.");
  }

  const quote = await Quote.findById(id).populate({
    path: "repairShopQuotes",
    populate: [
      { path: "repairShop", select: "companyName phoneNumber address" },
      {
        path: "items",
        model: "RepairShopQuote",
        select: "concept quantity unitPrice itemTotalPrice brand",
      },
    ],
  });

  if (!quote) {
    throw createError(404, "Quote not found.");
  }

  return quote;
}

async function calculateTotalById(id) {
  const quote = await Quote.findById(id).populate("repairShopQuotes");
  if (!quote) {
    throw createError(404, "Quote not found");
  }

  if (quote.repairShopQuotes.length === 0) {
    quote.total = 0;
    quote.totalFaiRefacFee = 0;
    quote.fee = 0;
    quote.status = "rejected";
  } else {
    const total = quote.repairShopQuotes.reduce((sum, repairShopQuote) => {
      return sum + (repairShopQuote.totalPrice || 0);
    }, 0);

    quote.total = total;
    quote.totalFaiRefacFee = parseFloat(total * (1.05).toFixed(2));
    quote.fee = quote.totalFaiRefacFee - total;
  }

  await quote.save();

  return quote;
}

async function rejectRepairShopQuoteById(id, repairShopQuoteId, clientId) {
  const car = await Car.findOne({ quotes: id });

  if (!car) {
    throw createError(404, "Car not found.");
  }

  const client = await Client.findOne({ cars: car._id });

  if (!client) {
    throw createError(404, "Client not found.");
  }

  if (client._id.toString() !== clientId.toString()) {
    throw createError(403, "Unauthorized to reject this quote.");
  }

  const quote = await Quote.findById(id);

  if (!quote) {
    throw createError(404, "Quote not found");
  }

  const repairShopQuote = quote.repairShopQuotes.find(
    (quote) => quote._id.toString() === repairShopQuoteId.toString()
  );

  if (!repairShopQuote) {
    throw createError(404, "RepairShopQuote does not belong to this quote");
  }

  repairShopQuote.status = "rejected";

  quote.repairShopQuotes = quote.repairShopQuotes.filter(
    (quote) => quote._id.toString() !== repairShopQuoteId.toString()
  );

  await RepairShopQuote.findByIdAndUpdate(repairShopQuoteId, {
    status: "rejected",
  });
  await quote.save();

  const calculateQuote = await calculateTotalById(id);

  return calculateQuote.populate({
    path: "repairShopQuotes",
    populate: [
      { path: "repairShop", select: "companyName phoneNumber address" },
      {
        path: "items",
        model: "RepairShopQuote",
        select: "concept quantity unitPrice itemTotalPrice brand",
      },
    ],
  });
}

async function createCheckoutSession(id, clientId) {
  const car = await Car.findOne({ quotes: id });

  if (!car) {
    throw createError(404, "Car not found.");
  }

  const client = await Client.findOne({ cars: car._id });

  if (!client) {
    throw createError(404, "Client not found.");
  }

  if (client._id.toString() !== clientId.toString()) {
    throw createError(403, "Unauthorized to create a pay session.");
  }

  const quote = await calculateTotalById(id);

  if (!quote.total || quote.total <= 0) {
    throw createError(400, "Quote total must be greater than zero");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "mxn",
          product_data: {
            name: "Cotización de refacciones",
          },
          unit_amount: Math.round(quote.totalFaiRefacFee * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/cancel`,
  });

  quote.sessionId = session.id;
  await quote.save();

  return session;
}

async function handleStripeEvent(req) {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_ENDPOINT_SECRET
    );
  } catch (error) {
    throw createError(500, `Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Checkout session completed for session:", session);

    const quote = await Quote.findOne({ sessionId: session.id }).populate(
      "repairShopQuotes"
    );

    if (quote) {
      quote.status = "paid";
      quote.paymentId = session.payment_intent;

      const updateRepairShopQuotes = quote.repairShopQuotes.map(
        async (repairShopQuoteId) => {
          const repairShopQuote = await RepairShopQuote.findById(
            repairShopQuoteId
          );
          if (repairShopQuote) {
            repairShopQuote.status = "paid";
            return await repairShopQuote.save();
          } else {
            console.log(
              "RepairShopQuote not found for session.id:",
              session.id
            );
          }
        }
      );

      await Promise.all(updateRepairShopQuotes);
      await quote.save();
      console.log(
        `Quote ${quote._id} and associated RepairShopQuotes marked as paid.`
      );
    } else {
      console.log("Quote not found for session.id:", session.id);
    }
  }

  if (event.type === "charge.updated") {
    const session = event.data.object;
    const quote = await Quote.findOne({ paymentId: session.payment_intent });
    console.log(quote);
    if (quote) {
      quote.ticketUrl = session.receipt_url;
      await quote.save();
    } else {
      console.log(
        "Quote not found for session.payment_intent:",
        session.payment_intent
      );
    }
  }

  return { success: true, message: "Event handled" };
}

async function quoteLinkTokenGenerater(clientId, carId) {
  const client = await Client.findById(clientId);
  if (!client) {
    throw createError(401, "Invalid data");
  }

  const car = await Car.findById(carId);
  if (!client) {
    throw createError(401, "Invalid data");
  }

  const token = jwt.signQuoteLink({ clientId: client._id, carId: car._id });
  return token;
}

module.exports = {
  login,
};

module.exports = {
  create,
  getById,
  calculateTotalById,
  rejectRepairShopQuoteById,
  createCheckoutSession,
  handleStripeEvent,
  quoteLinkTokenGenerater,
};
