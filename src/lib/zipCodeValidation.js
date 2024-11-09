const fs = require("fs");
const path = require("path");

const sepomexJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "sepomex.json"))
);

function validateZipCode(zipCode, state = null) {
  const zip = sepomexJson.find((entry) => entry.d_codigo === zipCode);

  if (!zip) {
    return { isValid: false, message: "Invalid zip code." };
  }

  const normalizedState = state ? state.toLowerCase() : null;
  const normalizedZipState = zip.d_estado.toLowerCase();

  if (normalizedState) {
    if (normalizedZipState === "ciudad de méxico") {
      if (
        normalizedState === "ciudad de méxico" ||
        normalizedState === "cdmx" ||
        normalizedState === "ciudad de mexico"
      ) {
        return { isValid: true };
      } else {
        return {
          isValid: false,
          message: `The zip code ${zipCode} does not belong to the state ${state}. Expected "Ciudad de México".`,
        };
      }
    }

    if (normalizedZipState === "méxico") {
      if (
        normalizedState === "méxico" ||
        normalizedState === "mexico" ||
        normalizedState === "edomex" ||
        normalizedState === "estado de mexico"
      ) {
        return { isValid: true };
      } else {
        return {
          isValid: false,
          message: `The zip code ${zipCode} does not belong to the state ${state}. Expected "México".`,
        };
      }
    }
  }

  if (normalizedZipState === normalizedState) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message: `The zip code ${zipCode} does not belong to the state ${state}.`,
  };
}

module.exports = validateZipCode;
