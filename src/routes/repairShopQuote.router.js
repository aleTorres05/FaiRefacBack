const express = require('express');
const repairShopQuoteUseCase = require('../usecases/repairShopQuote.usecase');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router.patch('/:id/update', auth, async (req, res) => {
    const { id } = req.params
    const updatedItems = req.body;
    
    if (!req.user || !req.user.repairShop || !req.user.repairShop._id) {
        return res.status(400).json({
            success: false,
            error: 'Unauthorized: repair shop information is missing or incomplete.',
        });
    }

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
    try {
        const repairShopQuote = await repairShopQuoteUseCase.getById(id);
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

router.patch('/:id/delete-item/:itemId', auth, async ( req, res ) => {
    const { id, itemId } = req.params

    if (!req.user || !req.user.client || !req.user.client._id) {
        return res.status(400).json({
            success: false,
            error: 'Unauthorized: client information is missing or incomplete.',
        });
    }
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

router.patch('/:id/change-status', auth, async ( req, res) => {
    const { id } = req.params;

    if (!req.user || !req.user.repairShop || !req.user.repairShop._id) {
        return res.status(400).json({
            success: false,
            error: 'Unauthorized: repair shop information is missing or incomplete.',
        });
    }

    const repairShopId = req.user.repairShop._id;

    if (!repairShopId) {
        
    }

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