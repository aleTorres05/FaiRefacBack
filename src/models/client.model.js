const mongoose = require('mongoose');
const setDefaultProfilePicture = require('../middlewares/profilePicture.middleware')


const modelName = 'Client';

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
    profilePicture: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(https?:\/\/[^\s$.?#].[^\s]*)$/i.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        },
        required: [false, 'Profile picture URL is optional'],
    },
    cars: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car" 
    }],
});

schema.pre('save', setDefaultProfilePicture);

module.exports = mongoose.model(modelName, schema);