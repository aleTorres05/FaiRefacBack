const mongoose = require('mongoose');

const modelName = "Quote"

const schema = new mongoose.Schema({
    originalQuote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OriginalQuote", 
        required: true,
    },
    repairShopQuotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RepairShopQuote", 
    }],
    total: {
        type: Number,
    },
    paymentId: {
        type: String,
    },
    status: {
        type: String,
        enum: ["initial", "paid", "rejected", "delivered"],
        default: "initial",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


module.exports = mongoose.model(modelName, schema);
