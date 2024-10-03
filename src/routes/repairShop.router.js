const express = require('express');
const repairShopUseCase = require('../usecases/repairShop.usecase');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router.get ('/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const repairShop = await repairShopUseCase.getById(id);
        res.json({
            success: true,
            data: { repairShop: repairShop }
        })
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            success: false,
            error: error.message
        })
    }
});

module.exports = router;