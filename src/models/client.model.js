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
    cars: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "car" 
    }],
    quotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "quote" 
    }],
})


module.exports = mongoose.model(modelName, schema);