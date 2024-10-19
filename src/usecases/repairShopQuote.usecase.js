const createError = require('http-errors');
const Client = require('../models/client.model')
const RepairShopQuote = require('../models/repairShopQuote.model');
const { default: mongoose } = require('mongoose');



async function updateById(id, repairShopId, updatedItems) {
    if (!Array.isArray(updatedItems)) {
        throw createError(400, "Invalid input. Expected an array of items.");
    }
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

            if (!updatedItem) {
                throw createError(405, "Item does not belong to the quote.")
            }
    
            if (updatedItem) {
                item.unitPrice = updatedItem.unitPrice;
                item.quantity = updatedItem.quantity || item.quantity;
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

async function getById(id) {

    if (!id) {
        createError (400, "Missing require data to get the info")
    };

    const repairShopQuote = RepairShopQuote.findById(id)
    .populate('car')
    .populate('mechanic')
    .populate('repairShop')

    if(!repairShopQuote) {
        throw createError (404, "Quote not found.")
    }

    return repairShopQuote
}

async function deleteItemById(id, clientId, itemId) {
    if (!id || !clientId || itemId) {
        createError (400, "Missing require data to delete the item.")
    }
    const client = await Client.findById(clientId)
    if (!client) {
        throw createError(404, "Client not found.")
    }
    const repairShopQuote = await RepairShopQuote.findById(id);
    if (!repairShopQuote) {
        throw createError(404, "Quote not found.")
    }

    const isCarInClient = client.cars.some(carId => carId.toString() === repairShopQuote.car.toString());
    if (!isCarInClient) {
        throw createError(401, "Unauthorized to update this quote.")
    }

    const updateRepairShopQuote =  await RepairShopQuote.findByIdAndUpdate( id,
        {
            $pull: {items: {_id: new mongoose.Types.ObjectId(itemId) }}
        },
        { new: true }
    );
    if (!updateRepairShopQuote) {
        throw createError(405, "Item does not belong to the quote.")
    }

    return updateRepairShopQuote
}

async function changeStatusById(id, repairShopId) {
    if (!id || !repairShopId) {
        throw createError(400, "Missing required data to change the status.");
    }

    try {
        const repairShopQuote = await RepairShopQuote.findById(id);
        
        if (!repairShopQuote) {
            throw createError(404, "Quote not found.");
        }
        
        if (!repairShopQuote.repairShop.equals(repairShopId)) {
            throw createError(403, "Unauthorized to update this quote.");
        }

        const nextState = {
            'paid': 'sent',
            'sent': 'delivered'
        };

        if (nextState[repairShopQuote.status]) {
            repairShopQuote.status = nextState[repairShopQuote.status];
            await repairShopQuote.save();
        } else {
            throw createError(403, "This quote is not available for status change.");
        }
        
        return repairShopQuote;
    } catch (error) {
        throw createError(500, error.message);
    }
}


module.exports = {
    updateById,
    getById,
    deleteItemById,
    changeStatusById,
}