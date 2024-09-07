const mongoose = require('mongoose');

const modelName = 'User'

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 85,
    },
    password: {
        type: String,
        required: true,
    },
    isClient: {
        type: Boolean,
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
    },
    isRepairShop: {
        type: Boolean,
        required: true,
    },
    repairShop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RepairShop",
    },
    created_at: {
        type: Date,
        default:Date.now,
    },
    verifiedEmail: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model(modelName, schema);