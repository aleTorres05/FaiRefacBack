const mongoose = require('mongoose');


const modelName = 'client';

const schema = new mongoose.Schema({
    name: {
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
    cars: [car],
    quotes: [quote],
})


module.exports = mongoose.model(modelName, schema);