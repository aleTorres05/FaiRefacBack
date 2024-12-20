const express = require("express");
const userUseCase = require("../usecases/user.usecase");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const createError = require('http-errors')

const router = express.Router();

router.get("/find-email/:email", auth, async (req, res) => {
  const { email } = req.params;
  const userId = req.user._id

  try {
    const user = await userUseCase.getByEmail(email, userId);
    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id
  try {
    if (id.toString() !== userId.toString()){
     throw createError (403, "Unauthorized to get the info.")
    }

    const user = await userUseCase.getById(id, req.user._id.toString());
    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const createdUser = await userUseCase.create(req.body);
    res.json({
      success: true,
      data: { User: createdUser },
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      error: error.message,
    });
  }
});

router.patch("/:id/client",auth, upload.single("profilePicture"), async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const file = req.file;

    try {
      const updatedUser = await userUseCase.updateByIdUserClient(id, req.body, userId, file);
      res.json({
        success: true,
        data: { user: updatedUser },
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

router.patch("/:id/repairShop", auth, upload.single("profilePicture"), async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const file = req.file;

    try {
      const updatedUser = await userUseCase.updateByIdUserRepairShop(id, req.body, userId, file);
      res.json({
        success: true,
        data: { user: updatedUser },
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

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const sendOTP = await userUseCase.generateAndSendOTP(email);
    res.json({
      success: true,
      data: { message: "OTP was sended successfuly." },
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const verifiedOTP = await userUseCase.verifyOTP(email, otp);
    res.json({
      success: true,
      data: { message: "User was successfyly verified." },
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      error: error.message,
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id

  try {
    const userDeleted = await userUseCase.deleteById(id, userId);
    res.json({
      success: true,
      data: { user: userDeleted }
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      error: error.message,
    });
  };
});

module.exports = router;
