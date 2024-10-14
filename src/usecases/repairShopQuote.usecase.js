const createError = require('http-errors');
const RepairShopQuote = require('../models/repairShopQuote.model');
const Quote = require('../models/quote.model');
const { default: mongoose } = require('mongoose');


async function updateById(id, repairShopId, updatedItems) {
    const session = await mongoose.startSession();
    session.startTransaction() 

    try {
        if (!id || !repairShopId || !updatedItems || updatedItems.length === 0) {
            throw createError(400, "Missing required data to update the quote.");
        }
    
        const repairShopQuote = await RepairShopQuote.findById(id);
    
        if(!repairShopQuote) {
            throw createError (404, "Quote not found.")
        }
    
        if (!repairShopQuote.repairShop.equals(repairShopId)) {
            throw createError (403, "Unauthorized to update this info.")
        }
    
    
        let totalPrice = 0;
        repairShopQuote.items = repairShopQuote.items.map(item => {
            const updatedItem = updatedItems.find(i => i._id === item._id.toString());
    
            if (updatedItem) {
                item.unitPrice = updatedItem.unitPrice;
                item.quantity = updatedItem.quantity;
                item.brand = updatedItem.brand;
    
                item.itemTotalPrice = item.unitPrice * item.quantity;
            }
    
            totalPrice += item.itemTotalPrice;
            return item;
        });
    
        repairShopQuote.totalPrice = totalPrice;
        repairShopQuote.status = "review";
    
        await repairShopQuote.save({ session });

        await session.commitTransaction();
        
        return repairShopQuote;

    } catch (error) {
        await session.abortTransaction();
        throw createError(500, error)
    } finally {
        session.endSession();
    }
}


module.exports = {
    updateById,
}