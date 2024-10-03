const createError = require('http-errors');
const RepairShop = require('../models/repairShop.model');



async function getById(id) {

    const repairShop = await RepairShop.findById(id)
    .populate({
        path: 'quotes.quoteId',
        model: 'Quote',
        populate: {
            path: 'client',
            model: 'Client'
        }
    })
    .populate({
        path: 'quotes.quoteId',
        populate: {
            path: 'car',
            model: 'Car'
        }
    })
    .populate({
        path: 'quotes.quoteId',
        populate: {
            path: 'mechanic',
            model: 'Mechanic'
        }
    });
    
    if (!repairShop) {
        throw createError(404, 'Repair shop not found.')
    }

    return repairShop;
}


module.exports = {
    getById,
}

