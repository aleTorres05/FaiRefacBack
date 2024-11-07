const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/:checkoutSessionId/payment-details", auth, async (req, res) => {
  const { checkoutSessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );

    res.json({
      success: true,
      data: {
        session,
        paymentIntent,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
