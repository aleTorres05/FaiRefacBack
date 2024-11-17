const createError = require("http-errors");
const encrypt = require("../lib/encrypt");
const User = require("../models/user.model");
const Client = require("../models/client.model");
const RepairShop = require("../models/repairShop.model");
const uploadToS3 = require("../lib/aws");
const { generateOTP, sendOTPEmail } = require("../lib/emailService");
const { getLatLngByZipCode, getNearbyZipCodes } = require("../lib/geoNames");
const { createExpressAccount } = require("../usecases/repairShop.usecase");

async function create(userData) {
  const emailFound = await User.findOne({ email: userData.email });
  if (emailFound) {
    throw createError(409, "Email already in use");
  }
  userData.password = await encrypt.encrypt(userData.password);

  const newUser = await User.create(userData);
  return newUser;
}

async function getByEmail(email, userId) {
  let user = await User.findOne({ email });

  if (!user) {
    throw createError(404, "User not found");
  }

  if (user._id.toString() !== userId.toString()) {
    throw createError(403, "Unauthorized to get the info.")
  }

  if (user.isClient) {
    user = await User.findOne({ email }).populate({
      path: "client",
      populate: {
        path: "cars",
        model: "Car",
        populate: {
          path: "quotes", 
          model: "Quote",
        }
      }
    });
  } else if (user.isRepairShop) {
    user = await User.findOne({ email }).populate({
      path: "repairShop",
      populate: {
        path: "quotes", 
        model: "RepairShopQuote",
        populate: [
          { path: "car", model: "Car" }, 
          { path: "mechanic", model: "Mechanic" }, 
        ]
      }
    });
  }

  return user;
}

async function getById(id) {

  let user = await User.findById(id);

  if (!user) {
    throw createError(404, "User not found");
  }

  if (user.isClient) {
    user = await User.findById(id).populate({
      path: "client",
      populate: {
        path: "cars",
        model: "Car",
        populate: {
          path: "quotes", 
          model: "Quote",
        }
      }
    });
  } else if (user.isRepairShop) {
    user = await User.findById(id).populate({
      path: "repairShop",
      populate: {
        path: "quotes", 
        model: "RepairShopQuote",
        populate: [
          { path: "car", model: "Car" }, 
          { path: "mechanic", model: "Mechanic" }, 
        ]
      }
    });
  }

  return user;
}

async function updateByIdUserClient(id, clientData, userId, file = null) {
  let user = await User.findById(id);

  if (!user) {
    throw createError(404, "User not found");
  }

  if (user._id.toString() !== userId.toString()) {
    throw createError(403, "Unauthorized to update this info");
  }

  if (user.client) {
    throw createError(405, "User cannot be updated");
  }

  if (user.isClient !== true) {
    throw createError(400, "User must be a client to perform this action");
  }

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
}

async function updateByIdUserRepairShop(id, repairShopData, userId, file = null) {
  let user = await User.findById(id);

  if (!user) {
    throw createError(404, "User not found");
  }

  if (user._id.toString() !== userId.toString()) {
    throw createError(403, "Unauthorized to update this info");
  }

  if (user.repairShop) {
    throw createError(405, "User cannot be updated");
  }

  if (user.isRepairShop !== true) {
    throw createError(
      400,
      "User must be a repair shop owner to perform this action"
    );
  }

  const { lat, lng } = await getLatLngByZipCode(repairShopData.address.zipCode);

  
  const nearbyZipCodes = await getNearbyZipCodes(lat, lng);
  
  repairShopData.nearbyZipCodes = nearbyZipCodes;

  const newRepairShop = await RepairShop.create(repairShopData);

  if (file) {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const imageUrl = await uploadToS3(file, bucketName);
    newRepairShop.profilePicture = imageUrl;
    await newRepairShop.save();
  }

  const createStripeAccountId = await createExpressAccount(newRepairShop._id)

  user.repairShop = newRepairShop._id;

  await user.save();

  user = await user.populate("repairShop");

  return user;
}

async function generateAndSendOTP(email) {
  const user = await User.findOne({ email });

  if (!user) {
    throw createError(404, "User not found.");
  }

  const otp = generateOTP();

  user.otp = otp;
  user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendOTPEmail(email, otp);

  return;
}

async function verifyOTP(email, otp) {
  const user = await User.findOne({ email });

  if (!user) {
    throw createError(404, "User not found");
  }

  if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
    throw createError(400, "Invalid or Expired OTP");
  }

  user.verifiedEmail = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  return;
}

async function deleteById(id, userId) {
  if (id.toString() !== userId.toString()) {
    throw createError(403, "Unauthorized to delete this user.")
  }
  const userDeleted = await User.findByIdAndDelete(id)

  if (!userDeleted) {
    throw createError(404, "User not found.")
  };

  return userDeleted;
}

module.exports = {
  create,
  getById,
  updateByIdUserClient,
  updateByIdUserRepairShop,
  generateAndSendOTP,
  verifyOTP,
  getByEmail,
  deleteById,
};
