const Quote = require('../models/quote.model');
const Client = require('../models/client.model');
const Car = require('../models/car.model');
const RepairShop = require('../models/repairShop.model');
const Mechanic = require('../models/mechanic.model');
const createError = require('http-errors');



async function create({ clientId, carId, mechanicId, items }) {

    if (!clientId || !carId || !mechanicId || items.length === 0) {
        throw createError(400, "Missing required data to create the quote.")
    }

    const client = await Client.findById(clientId).populate('cars');
    if (!client) {
        throw createError(404, "Client not found.");
    }

    const car = client.cars.find(car => car._id.toString() === carId);
    if (!car) {
        throw createError(404, "Car does not belong to the client.");
    }

    const mechanic = await Mechanic.findById(mechanicId);
    if (!mechanic) {
        throw createError(404, "Mechanic not found.");
    }

    const repairShops = await RepairShop.find({ "address.zipCode": mechanic.address.zipCode });
    if (!repairShops.length) {
        throw createError(404, "No repair shops found for the mechanic's postal code. ");
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

    client.quotes.push({
        quoteId: savedQuote._id,
        status: 'initial',
        repairShopId: null
    });
    await client.save();

    for (const repairShop of repairShops) {
        repairShop.quotes.push({
            quoteId: savedQuote._id,
            status: 'initial'
        });
        await repairShop.save();
    }


    const populatedQuote = await savedQuote.populate([
        { path: 'client', model: 'Client' },
        { path: 'car', model: 'Car' },
        { path: 'mechanic', model: 'Mechanic' }
    ]);

    return populatedQuote;

}

async function createQuoteVersionByRepairShop(quoteId, repairShopId, items) {
    const originalQuote = await Quote.findById(quoteId);
    if (!originalQuote) {
        throw createError(404, "Original quote not found.");
    }

    const client = await Client.findById(originalQuote.client);
    if (!client) {
        throw createError(404, "Client not found.");
    }

    if (!originalQuote.repairShops.includes(repairShopId)) {
        throw createError(403, "Repair shop is not authorized to create a version of this quote.");
    }

    const updatedItems = items.map(item => {
        const originalItem = originalQuote.items.id(item._id);
        if (!originalItem) {
            throw createError(404, `Item with id ${item._id} not found in original quote.`);
        }

        return {
            ...originalItem.toObject(),  
            unitPrice: item.unitPrice,   
            brand: item.brand,
            itemTotalPrice: originalItem.quantity * item.unitPrice 
        };
    });

    const newQuote = new Quote({
        client: originalQuote.client,
        car: originalQuote.car,
        mechanic: originalQuote.mechanic,
        repairShops: [repairShopId],
        items: updatedItems,
        totalPrice: updatedItems.reduce((total, item) => total + item.itemTotalPrice, 0),
        status: 'quoted',
        quotedByRepairShop: repairShopId
    });

    await newQuote.save();

   client.quotes.push({
    quoteId: newQuote._id,
    status: 'reviewed',
    repairShopId,
   });
   await client.save();

   const repairShop = await RepairShop.findById(repairShopId);
   repairShop.quotes.push({
    quoteId: newQuote._id,
    status:'reviewed'
   });
   await repairShop.save()

    return newQuote;
}

async function getById(id) {
    const quote = await Quote.findById(id)
    .populate({
        path: 'client',
        model: 'Client'
    })
    .populate({
        path: 'car',
        model: 'Car'
    })
    .populate({
        path: 'mechanic',
        model: 'Mechanic'
    })
    .populate({
        path: 'repairShops',
        model: 'RepairShop'
    })
    .populate({
        path: 'quotedByRepairShop',
        model: 'RepairShop'
    });
    
    if (!quote) {
    throw createError(404, 'Quote not found')
    }

    return quote
}




module.exports = {
    create,
    createQuoteVersionByRepairShop,
    getById,
};