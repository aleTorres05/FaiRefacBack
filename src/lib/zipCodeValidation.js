const fs = require("fs");
const path = require("path");

const sepomexJson = Json.parse(
  fs.readFileSync(path.join(__dirname, "sepomex.json"))
);

function validateZipCode(zipCode, state = null) {
  const zip = sepomexJson.find((entry) => entry.d_codigo === zipCode);

  if (!zip) {
    return { isValid: false, message: "invalid zipCode." };
  }

  if (state && zip.d_estado !== state) {
    return {
      isValid: false,
      message: `The zipCode: ${zipCode} does not belong to the state: ${state}.`,
    };
  }

  return { isValid: true };
}

module.exports = validateZipCode;
