const express = require("express");
const repairShopUseCase = require("../usecases/repairShop.usecase");
const auth = require("../middlewares/auth.middleware");
const validateUserType = require("../middlewares/validateUserType.middleware");

const router = express.Router();

router.get("/:id", auth, validateUserType("repairShop"), async (req, res) => {
  const { id } = req.params;
  const repairShopId = req.user.repairShop._id;

  try {
    const repairShop = await repairShopUseCase.getById(id, repairShopId);
    res.json({
      success: true,
      data: { repairShop: repairShop },
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      error: error.message,
    });
  }
});

router.get(
  "/account-link/:id",
  auth,
  validateUserType("repairShop"),
  async (req, res) => {
    const { id } = req.params;
    const repairShopId = req.user.repairShop._id;

    try {
      const accountLink = await repairShopUseCase.createAccountLink(
        id,
        repairShopId
      );
      res.json({
        success: true,
        data: { accountLink },
      });
    } catch (error) {
      res.status(error.status || 500);
      res.json({
        success: false,
        error: error.message,
      });
    }
  }
);

router.get(
  "/account/:id",
  auth,
  validateUserType("repairShop"),
  async (req, res) => {
    const { id } = req.params;
    const repairShopId = req.user.repairShop._id;

    try {
      const updatedAccount = await repairShopUseCase.updateStripeAccount(
        id,
        repairShopId
      );
      res.json({
        success: true,
        message: "Repair shop payment info successfully updated",
      });
    } catch (error) {
      res.status(error.status || 500);
      res.json({
        success: false,
        error: error.message,
      });
    }
  }
);

module.exports = router;
