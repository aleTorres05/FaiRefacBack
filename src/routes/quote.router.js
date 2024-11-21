const express = require("express");
const quoteUseCase = require("../usecases/quote.usecase");
const auth = require("../middlewares/auth.middleware");
const {
  quoteLinkAuth,
  checkRevokedToken,
} = require("../middlewares/quoteLink.middleware");
const { revokeToken } = require("../middlewares/quoteLink.middleware");
const validateUserType = require("../middlewares/validateUserType.middleware");

const router = express.Router();

router.post("/create/car/:carId/mechanic/:mechanicId", async (req, res) => {
  try {
    const { carId, mechanicId, clientId } = req.params;
    const { items } = req.body;

    if (clientId && carId) {
      await quoteLinkAuth(req, res);
    }

    const quote = await quoteUseCase.create(carId, mechanicId, items);
    res.json({
      success: true,
      data: { quote },
    });
  } catch (error) {
    res.status(error.estatus || 500);
    res.json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/:id", auth, validateUserType("client"), async (req, res) => {
  const { id } = req.params;
  const clientId = req.user.client._id;
  try {
    const quote = await quoteUseCase.getById(id, clientId);
    res.json({
      success: true,
      data: { quote },
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/calculate/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const quote = await quoteUseCase.calculateTotalById(id);
    res.json({
      success: true,
      data: { quote },
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      error: error.message,
    });
  }
});

router.patch(
  "/:id/reject/:repairShopQuoteId",
  auth,
  validateUserType("client"),
  async (req, res) => {
    const { id, repairShopQuoteId } = req.params;
    const clientId = req.user.client._id;
    try {
      const quote = await quoteUseCase.rejectRepairShopQuoteById(
        id,
        repairShopQuoteId,
        clientId
      );
      res.json({
        success: true,
        data: { quote },
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

router.post(
  "/:id/create-checkout-session",
  auth,
  validateUserType("client"),
  async (req, res) => {
    const { id } = req.params;
    const clientId = req.user.client._id;
    try {
      const session = await quoteUseCase.createCheckoutSession(id, clientId);
      res.json({
        success: true,
        data: { session },
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

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const result = await quoteUseCase.handleStripeEvent(req);
      res.json({
        success: true,
        data: { result },
      });
    } catch (error) {
      console.error("Error handling Stripe event:", error);
      res.status(error.status || 500);
      res.json({
        success: false,
        error: error.message,
      });
    }
  }
);

router.post("/quote-link-token/:clientId/:carId", async (req, res) => {
  try {
    const { clientId, carId } = req.body;
    const token = await quoteUseCase.quoteLinkTokenGenerater(clientId, carId);
    res.json({
      succes: true,
      data: { token },
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/validate-token", async (req, res) => {
  try {
    const response = await quoteLinkAuth(req, res);

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/validate-cancel-Link", async (req, res) => {
  try {
    const response = await checkRevokedToken(req, res);
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/revoke-token", (req, res) => {
  const authorization = req.headers.authorization;
  if (!authorization)
    return res.status(401).json({ message: "No token provided" });

  try {
    if (!authorization) {
      return res.status(400).json({ message: "Invalid token format" });
    }
    revokeToken(authorization);
    res.status(200).json({ message: "Token revoked successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to revoke token" });
  }
});

router.get(
  "/payment-info/:sessionId",
  auth,
  validateUserType("client"),
  async (req, res) => {
    const sessionId = req.params.sessionId;
    const clientId = req.user.client._id;

    try {
      const paymentInfo = await quoteUseCase.getPaymentInfoBySessionId(
        sessionId,
        clientId
      );
      res.json({
        succes: true,
        data: paymentInfo,
      });
    } catch (error) {
      res.status(error.status || 500);
      res.json({
        succes: false,
        error: error.message,
      });
    }
  }
);

module.exports = router;
