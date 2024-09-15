const Quote = require('../models/quote.model');
const Client = require('../models/client.model');
const Car = require('../models/car.model');
const RepairShop = require('../models/repairShop.model');
const Mechanic = require('../models/mechanic.model');
const createEror = require('http-errors');

async function create({ clientId, carId, mechanicId, items }) {

    if (!clientId || !carId || !mechanicId || items.length === 0) {
        throw createEror(400, "Missing required data to create the quote.")
    }

    const client = await Client.findById(clientId).populate('cars');
    if (!client) {
        throw createEror(404, "Client not found.");
    }

    const car = client.cars.find(car => car._id.toString() === carId);
    if (!car) {
        throw createEror(404, "Car does not belong to the client.");
    }

    const mechanic = await Mechanic.findById(mechanicId);
    if (!mechanic) {
        throw createEror(404, "Mechanic not found.");
    }

    const repairShops = await RepairShop.find({ "address.zipCode": mechanic.address.zipCode });
    if (!repairShops.length) {
        throw createEror(404, "No repair shops found for the mechanic's postal code. ");
    }

    const newQuote = new Quote({
        client: clientId,
        car: carId,
        mechanic: mechanicId,
        items,
        repairShops: repairShops.map(shop => shop._id),
        status: "pending",
        totalPrice: 0
    });

    const savedQuote = await newQuote.save();

    client.quotes.push(savedQuote._id);
    await client.save();

    car.quotes.push(savedQuote._id);
    await car.save();

    const populatedQuote = await savedQuote.populate([
        { path: 'client', model: 'Client' },
        { path: 'car', model: 'Car' },
        { path: 'mechanic', model: 'Mechanic' }
    ]);

    return populatedQuote;

}

module.exports = {
    create,
};