const createError = require("http-errors");
const jwt = require("../lib/jwt");

const revokedTokens = new Set();

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

async function checkRevokedToken(req, res) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw createError(401, "JWT is required");
    }

    if (revokedTokens.has(authorization)) {
      return res.status(403).json({ message: "Token is revoked" });
    }
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

function revokeToken(token) {
  revokedTokens.add(token);
}

module.exports = { quoteLinkAuth, checkRevokedToken, revokeToken };
