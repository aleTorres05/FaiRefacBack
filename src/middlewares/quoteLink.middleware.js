const createError = require("http-errors");
const clientUseCase = require("../usecases/client.usecase");
const carUseCase = require("../usecases/car.usecase");
const jwt = require("../lib/jwt");

async function quoteLinkAuth(req, res) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw createError(401, "JWT is required");
    }
    const payload = jwt.verify(authorization);

    return { clientId: payload.clientId, carId: payload.carId };
  } catch (error) {
    res.status(401);
    res.json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = quoteLinkAuth;
