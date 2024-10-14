const express = require('express');
const quoteUseCase = require('../usecases/quote.usecase');
const auth = require('../middlewares/auth.middleware');


const router = express.Router();

router.post('/create', auth, async (req,res) => {
    try {
        const { carId, mechanicId, items } = req.body;
        const quote = await quoteUseCase.create({ carId, mechanicId, items });
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
    };
});

router.post('/:id/repairshops/:repairShopId', auth, async (req, res) => {
    try {
        const { id, repairShopId } = req.params;
        const items = req.body.items;

        const newQuote = await quoteUseCase.createQuoteVersionByRepairShop(id, repairShopId, items);
        res.json({
            success: true,
            data: { quote: newQuote, },
        });
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            success: false,
            message: error.message,
        });
    };
});

router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const quote = await quoteUseCase.getById(id);
        res.json ({
            success: true,
            data: { quote },
        });
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            success: false,
            message: error.message,
        });
    };
});


module.exports = router;
