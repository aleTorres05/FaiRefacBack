const mongoose = require('mongoose');

const modelName = 'OriginalQuote'

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
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model(modelName, schema);
