const mongoose = require('mongoose');


const modelName = "Car"

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
        ref: 'Quote'
    }],
    carPicture: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(https?:\/\/[^\s$.?#].[^\s]*)$/i.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        },
        required: [false, 'Profile picture URL is optional'],
        default: "https://fairefac-assets.s3.us-east-2.amazonaws.com/FaiRefac-default-car-picture.png"
    },
})



module.exports = mongoose.model(modelName, schema);