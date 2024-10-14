const express = require('express');
const repairShopQuoteUseCase = require('../usecases/repairShopQuote.usecase');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router.patch('/update', async (req, res) => {
    try {
        const { id, repairShopid, updatedItems} = req.body;
        const updatedQuote = await repairShopQuoteUseCase.updateById(id, repairShopid, updatedItems);
        res.json({
            success: true,
            data: { updatedQuote },
        }) 
    } catch (error) {
        res.status (error.status || 500);
        res.json({
            success: false,
            error: error.message,
        });
    };
});

module.exports = router;