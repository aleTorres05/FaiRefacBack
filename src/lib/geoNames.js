const axios = require("axios");
const createError = require("http-errors");

const user = process.env.GEONAMES_USER_NAME;

async function getLatLngByZipCode(zipCode) {
  const url = `http://api.geonames.org/postalCodeSearchJSON?postalcode=${zipCode}&country=MX&username=${user}`;
  try {
    const response = await axios.get(url);
    if (response.data.postalCodes && response.data.postalCodes.length > 0) {
      const { lat, lng } = response.data.postalCodes[0];
      return { lat, lng };
    } else {
      throw createError(404, "No location found for the provided postal code.");
    }
  } catch (error) {
    console.error("Error fetching lat/lng:", error.message);
    if (error.response) {
      throw createError(
        error.response.status,
        `GeoNames API returned an error: ${
          error.response.data.status?.message || "Unknown error"
        }`
      );
    }
    throw createError(500, "Failed to fetch lat/lng from GeoNames API.");
  }
}

async function getNearbyZipCodes(lat, lng) {
  const url = `http://api.geonames.org/findNearbyPostalCodesJSON?lat=${lat}&lng=${lng}&radius=30&username=${user}`;
  try {
    const response = await axios.get(url);
    if (response.data.postalCodes && response.data.postalCodes.length > 0) {
      return response.data.postalCodes.map((code) => code.postalCode);
    } else {
      throw createError(
        404,
        "No nearby postal codes found for the given coordinates."
      );
    }
  } catch (error) {
    console.error("Error fetching nearby postal codes:", error.message);
    if (error.response) {
      throw createError(
        error.response.status,
        `GeoNames API returned an error: ${
          error.response.data.status?.message || "Unknown error"
        }`
      );
    }
    throw createError(
      500,
      "Failed to fetch nearby postal codes from GeoNames API."
    );
  }
}

module.exports = {
  getLatLngByZipCode,
  getNearbyZipCodes,
};
