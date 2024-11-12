const express = require("express");
const clientUseCase = require("../usecases/client.usecase");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const validateUserType = require("../middlewares/validateUserType.middleware");

const router = express.Router();

router.post(
  "/:id/car",
  auth,
  validateUserType("client"),
  upload.single("carPicture"),
  async (req, res) => {
    const { id } = req.params;
    const clientId = req.user.client._id;
    const carData = req.body;
    const file = req.file;

    try {
      const updatedClient = await clientUseCase.associateCarWithClient(
        id,
        clientId,
        carData,
        file
      );
      res.json({
        success: true,
        message: "Car was successfully created",
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

router.get("/:id", auth, validateUserType("client"), async (req, res) => {
  const { id } = req.params;
  const clientId = req.user.client._id;

  try {
    const client = await clientUseCase.getById(id, clientId);
    res.json({
      success: true,
      data: { client },
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
