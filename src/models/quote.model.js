const mongoose = require('mongoose');

const modelName = "Quote"

const schema = new mongoose.Schema({
    items: [{
        concept: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        }
    }],
    repairShopQuotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RepairShopQuote", 
    }],
    total: {
        type: Number,
    },
    totalFaiRefacFee: {
        type: Number,
    },
    fee: {
        type: Number,
    },
    paymentId: {
        type: String,
    },
    sessionId: {
        type: String,
    },
    ticketUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ["initial", "modify", "paid", "rejected", "sent", "delivered"],
        default: "initial",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model(modelName, schema);
