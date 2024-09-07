const mongoose = require('mongoose');

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
        street: String,
        extNum: String,
        intNum: String,
        neighborhood: String,
        zipCode: String,
        city: String,
        state: String,
    },
    quote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quote"
    }
});

module.exports = mongoose.model(modelName, schema);