const createError = require('http-errors');
const encrypt = require('../lib/encrypt');
const User = require('../models/user.model');


async function create(userData) {
    const emailFound = await User.findOne({ email: userData.email});
    if (emailFound) {
        throw createError( 409, "Email already in use");
    };
    userData.password = await encrypt.encrypt(userData.password);

    const newUser = await User.create(userData);
    return newUser;
};

module.exports = {
    create,
};