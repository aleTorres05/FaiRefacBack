const createError = require('http-errors');
const encrypt = require('../lib/encrypt');
const User = require('../models/user.model');
const Client = require('../models/client.model');
const RepairShop = require('../models/repairShop.model');
const uploadToS3  = require('../lib/aws');


async function create(userData) {
    const emailFound = await User.findOne({ email: userData.email});
    if (emailFound) {
        throw createError( 409, "Email already in use");
    };
    userData.password = await encrypt.encrypt(userData.password);

    const newUser = await User.create(userData);
    return newUser;
};

async function getById(id) {
    let user = await User.findById(id)
    
    if (!user) {
        throw createError(404, "User not found")
    };

    if (user.isClient) {
        user = await User.findById(id)
        .populate({
            path: "client",
            populate: {
                path: "cars",
                model: "Car"
            }
        });
    } else if (user.isRepairShop) {
        user= await User.findById(id)
        .populate("repairShop");
    }; 

    return user;
    
};

async function updateByIdUserClient(id, clientData, userId, file = null ) {

    let user = await User.findById(id);

    if (!user) {
        throw createError(404, 'User not found');
    };

    if (user._id.toString() !== userId.toString()) {
        throw createError(403, 'Unauthorized to update this info')
    };

    if (user.client) {
        throw createError(405, 'User cannot be updated')
    };

    if (user.isClient !== true) {
        throw createError(400, 'User must be a client to perform this action');
    };

    const newClient = await Client.create(clientData);

    if (file) {
        const bucketName = process.env.AWS_BUCKET_NAME;
        const imageUrl = await uploadToS3(file, bucketName);
        newClient.profilePicture = imageUrl;
        await newClient.save(); 
    }

    user.client = newClient._id;

    await user.save();

    user = await user.populate("client");

    return user;
};

async function updateByIdUserRepairShop(id, repairShopData, userId, file = null) {

    let user = await User.findById(id);

    if (!user) {
        throw createError(404, 'User not found');
    };

    if (user._id.toString() !== userId.toString()) {
        throw createError(403, 'Unauthorized to update this info')
    };

    if (user.repairShop) {
        throw createError(405, 'User cannot be updated')
    };

    if (user.isRepairShop !== true) {
        throw createError(400, 'User must be a repair shop owner to perform this action');
    };

    const newRepairShop = await RepairShop.create(repairShopData);

    if (file) {
        const bucketName = process.env.AWS_BUCKET_NAME;
        const imageUrl = await uploadToS3(file, bucketName);
        newRepairShop.profilePicture = imageUrl;
        await newRepairShop.save(); 
    }

    user.repairShop = newRepairShop._id;

    await user.save();

    user = await user.populate("repairShop");

    return user;
}



module.exports = {
    create,
    getById,
    updateByIdUserClient,
    updateByIdUserRepairShop,
};