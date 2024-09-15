const createError = require('http-errors');
const Client = require('../models/client.model');
const Car = require('../models/car.model');

async function associateCarWithClient(clientId, carData) {

    const client = await Client.findById(clientId);

    if (!client) {
        throw createError(404,'Client not found');
    }

    const newCar = await Car.create(carData);

    client.cars.push(newCar._id);

    await client.save();

    return client.populate("cars");
};

async function getById(id) {
    const client = await Client.findById(id)
    
    if (!client) {
        throw createError(404, 'Client not found');
    }

    return client.populate("cars");
}

module.exports = {
    associateCarWithClient,
    getById,
}