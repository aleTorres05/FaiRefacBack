const mongoose = require('mongoose');

const modelName = 'RepairShopQuote'

const schema = new mongoose.Schema({
    originalQuote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OriginalQuote", 
        required: true,
    },
    repairShop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RepairShop",
    },
    items: [{
        concept: { 
            type: String,
        },
        quantity: {
            type: Number,
        },
        unitPrice: {
            type: Number,
        },
        itemTotalPrice: {
            type: Number,
        },
        brand: {
            type: String,
        }
    }],
    totalPrice: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model(modelName, schema);