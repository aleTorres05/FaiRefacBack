const mongoose = require('mongoose');


const modelName = 'Client';

const quoteStateSchema = new mongoose.Schema({
    quoteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quote",
        required: true,
    },
    status: {
        type: String,
        enum: ["initial", "reviewed", "paid", "rejected", "delivered"],
        default: "initial",
    },
    repairShopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RepairShop"
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
    },
    lastName: {
        type: String,
        minLength: 2,
        maxLength:20,
    },
    phoneNumber: {
        type: String,
        required: true,
        minLength: 10,
        maxLength:10,
    },
    cars: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car" 
    }],
    quotes: [quoteStateSchema],
});


module.exports = mongoose.model(modelName, schema);