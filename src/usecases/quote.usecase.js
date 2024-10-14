const Quote = require('../models/quote.model');
const RepairShopQuote = require('../models/repairShopQuote.model');
const Car = require('../models/car.model');
const RepairShop = require('../models/repairShop.model');
const Mechanic = require('../models/mechanic.model');
const createError = require('http-errors');

async function create({ carId, mechanicId, items }) {
    
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

    const repairShops = await RepairShop.find({ "address.zipCode": mechanic.address.zipCode });
    if (!repairShops.length) {
        throw createError(404, "No repair shops found for the mechanic's postal code.");
    }

    const newQuote = new Quote({
        items: items.map(item => ({
            concept: item.concept,
            quantity: item.quantity,
        })),
        total: 0,
        status: "initial",
    });

    const savedQuote = await newQuote.save();

    car.quotes.push(savedQuote._id);
    await car.save();

    await Promise.all(repairShops.map(async (shop) => {
        const newRepairShopQuote = new RepairShopQuote({
            car: carId,
            mechanic: mechanicId,
            repairShop: shop._id,
            items: items.map(item => ({
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
    }));

    await newQuote.save();

    return newQuote; 
}


async function getById(id) {
    if (!id) {
        throw createError(400, "Quote ID is required.");
    }

    const quote = await Quote.findById(id)
        .populate({
            path: 'repairShopQuotes',
            populate: [
                { path: 'repairShop', select: 'companyName phoneNumber address' }, 
                {
                    path: 'items', 
                    model: 'RepairShopQuote',
                    select: 'concept quantity unitPrice itemTotalPrice brand'
                }
            ]
        });

    
    if (!quote) {
        throw createError(404, "Quote not found.");
    }

    return quote;
}

module.exports = {
    create,
    getById,
};
