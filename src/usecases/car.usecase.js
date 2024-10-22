const Car = require('../models/car.model');
const Client = require('../models/client.model');
const createError = require('http-errors');


async function getById(id, clientId) {
    const client = await Client.findById(clientId)
    if (!client) {
        throw createError(404, "Client not found.")
    }

    const carBelongsToClient = client.cars.some(carId => carId.toString() === id.toString());
    
    if (!carBelongsToClient) {
        throw createError(403, "You do not have permission to view this car.");
    }
    const car = await Car.findById(id)
    .populate([{
                path: 'quotes',
                model: 'Quote',
                populate: {
                    path: 'repairShopQuotes',
                    model: 'RepairShopQuote',
                    populate: [
                        { path: 'car', model: 'Car' },
                        { path: 'mechanic', model: 'Mechanic' },
                        { path: 'repairShop', model: 'RepairShop' }
                    ]
                }
            }]);

    if (!car) {
        throw createError(404, "Car not found");
    }

    return car;
}

module.exports = {
    getById
}