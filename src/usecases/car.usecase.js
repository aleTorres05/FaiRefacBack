const Car = require('../models/car.model');
const createError = require('http-errors');


async function getById(id) {
    const car = Car.findById(id)
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