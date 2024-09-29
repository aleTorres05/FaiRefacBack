const express = require('express');
const quoteUseCase = require('../usecases/quote.usecase');

const router = express.Router();

router.post('/create', async (req,res) => {
    try {
        const { clientId, carId, mechanicId, items } = req.body;
        const quote = await quoteUseCase.create({ clientId, carId, mechanicId, items });
        res.json({
            success: true,
            data: { quote }, 
        })
    } catch (error) {
        res.status(error.estatus || 500);
        res.json({
            success: false,
            error: error.message,
        });
    }
});

router.post('/:quoteId/repairshops/:repairShopId', async (req, res) => {
    try {
        const { quoteId, repairShopId } = req.params;
        const items = req.body.items;

        const newQuote = await quoteUseCase.createQuoteVersionByRepairShop(quoteId, repairShopId, items);

        return res.status(201).json({
            success: true,
            data: {
                quote: newQuote,
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message,
        });
    }
});


module.exports = router;
