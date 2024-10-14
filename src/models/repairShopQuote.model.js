const mongoose = require('mongoose');

const modelName = 'RepairShopQuote'

const schema = new mongoose.Schema({
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        required: true,
    },
    mechanic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mechanic",
        required: true,
    },
    repairShop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RepairShop",
        required: true,
    },
    items: [{
        concept: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
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
    status: {
        type: String,
        enum: ["initial", "review", "modify", "paid", "rejected", "delivered"],
        default: "initial",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model(modelName, schema);