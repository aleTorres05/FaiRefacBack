const express = require('express');
const repairShopQuoteUseCase = require('../usecases/repairShopQuote.usecase');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router.patch('/update', auth, async (req, res) => {
    const { id, repairShopid, updatedItems} = req.body;
    try {
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

router.get('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const repairShopQuote = await repairShopQuoteUseCase.getById(id);
        res.json({
            success:true, 
            data: { quote: repairShopQuote },
        })
    } catch (error) {
        res.status (error.status || 500);
        res.json({
            succes: false,
            error: error.message,
        });
    };
});

module.exports = router;