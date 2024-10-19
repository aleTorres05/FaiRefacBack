const express = require('express');
const repairShopQuoteUseCase = require('../usecases/repairShopQuote.usecase');
const auth = require('../middlewares/auth.middleware');
const validateUserType = require('../middlewares/validateUserType.middleware');

const router = express.Router();

router.patch('/:id/update', auth, validateUserType('repairShop'), async (req, res) => {
    const { id } = req.params
    const updatedItems = req.body;
    const repairShopId = req.user.repairShop._id

    try {
        const updatedQuote = await repairShopQuoteUseCase.updateById(id, repairShopId, updatedItems);
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
    const user = req.user;
    try {
        const repairShopQuote = await repairShopQuoteUseCase.getById(id, user);
        res.json({
            success:true, 
            data: { quote: repairShopQuote },
        })
    } catch (error) {
        res.status (error.status || 500);
        res.json({
            success: false,
            error: error.message,
        });
    };
});

router.patch('/:id/delete-item/:itemId', auth, validateUserType('client'), async ( req, res ) => {
    const { id, itemId } = req.params
    const clientId = req.user.client._id

    try {
        const updateRepairshopQuote = await repairShopQuoteUseCase.deleteItemById(id, clientId, itemId);
        res.json({
            success: true,
            message: "Item was succesfully deleted",
        });
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            success: false,
            error: error.message,
        });
    };
});

router.patch('/:id/change-status', auth, validateUserType('repairShop'), async ( req, res) => {
    const { id } = req.params;
    const repairShopId = req.user.repairShop._id;

    try {
        const updateRepairShopQuote = await repairShopQuoteUseCase.changeStatusById(id, repairShopId);
        res.json({
            succes: true,
            data: { updateRepairShopQuote },
        })
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            succes: false,
            error: error.message,
        });
    };
});

module.exports = router;