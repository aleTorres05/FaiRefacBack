const createError = require('http-errors');
const RepairShop = require('../models/repairShop.model');



async function getById(id, repairShopId) {

    
    if (id.toString() != repairShopId.toString()) {
       throw createError (403, "Unauthorized to get the repair shop info.")
    }

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

