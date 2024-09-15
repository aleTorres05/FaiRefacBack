const mongoose = require('mongoose');


const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100,
    },
    extNum: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 10,
    },
    intNum: {
        type: String,
        minLength: 1,
        maxLength: 10,
    },
    neighborhood: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100,
    },
    zipCode: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 10,
    },
    city: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50,
    },
    state: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50,
    },
});

const modelName = "RepairShop"

const schema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
    },
    phoneNumber: {
        type: Number,
        required: true,
        minLength: 10,
        maxLength: 10,
    },
    address: {
        type: addressSchema,
        required: true,
    },
    quotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quote",
    }]
});

module.exports = mongoose.model(modelName, schema);