const createError = require('http-errors');
const RepairShop = require('../models/repairShop.model');



async function getById(id) {
    const repairShop = await RepairShop.findById(id)
        .populate({
            path: 'quotes',
            model: 'RepairShopQuote',
            populate: [
                {
                    path: 'car',
                    select: 'brand model year version'
                },
                {
                    path: 'mechanic',
                    model: 'Mechanic'
                }
            ]
        });

    if (!repairShop) {
        throw createError(404, 'Repair shop not found.');
    }

    return repairShop;
}


module.exports = {
    getById,
}

