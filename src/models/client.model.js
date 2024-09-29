const mongoose = require('mongoose');


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
    cars: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car" 
    }],
    quotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quote" 
    }],
    reviewedQuotesByRepairShops: [{
            quoteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote' },
            repairShopId: { type: mongoose.Schema.Types.ObjectId, ref: 'RepairShop' }
    }],
})


module.exports = mongoose.model(modelName, schema);