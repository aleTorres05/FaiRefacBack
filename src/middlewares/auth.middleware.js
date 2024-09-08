const createError = require('http-errors');
const userUseCase = require('../usecases/user.usecase');
const jwt = require('../lib/jwt');

async function auth( req, res, next) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            throw createError (401, "JWT is required");
        }
        const payload = jwt.verify(authorization);
        const user = await userUseCase.getById(payload.id);

        req.user = user;

        next();
    } catch (error) {
        res.status(401)
        res.json({
            success: false,
            error: error.message,
        });
    }
}

module.exports = auth;