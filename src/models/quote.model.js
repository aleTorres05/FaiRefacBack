const mongoose = require('mongoose');


const QouteItemSchema = new mongoose.Schema({
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
    }
});

const modelName = "Quote"

const schema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
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
    items: [QouteItemSchema],
    repairShops: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RepairShop",
    }],
    status: {
        type: String,
        enum: ["pending", "paid", "rejected", "shipped", "delivered"],
        default: "pending",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    totalPrice: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model(modelName, schema);