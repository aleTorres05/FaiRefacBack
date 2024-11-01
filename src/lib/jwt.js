const jsonwebtoken = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

function sign(payload) {
  return jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

function verify(token) {
  return jsonwebtoken.verify(token, JWT_SECRET);
}

function signQuoteLink(payload) {
  return jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

module.exports = {
  sign,
  verify,
  signQuoteLink,
};
