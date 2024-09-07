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

const modelName = "Mechanic"

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 25,
    },
    lastName: {
        type: String,
        required:true,
        minLength: 2,
        maxLength: 25,
    },
    workshopName: {
        type: String,
        required:true,
        minLength: 2,
        maxLength: 25,
    },
    phoneNumber: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 10,
    },
    address: {
        type: addressSchema,
        required: true,
    },
    quote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quote"
    }
});

module.exports = mongoose.model(modelName, schema);