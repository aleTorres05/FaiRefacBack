const mongoose = require('mongoose');

const modelName = "car"

const schema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
    },
    model: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
    },
    year: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 4,
    },
    version: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 100,

    },
    nickname: {
        type: String,
        minLength: 2,
        maxLength: 25,
    },
    quotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "quote" 
    }],
    carPic: {
        type: String,
    },
})

module.exports = mongosse.model(modelName, schema);