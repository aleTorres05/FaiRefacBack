const express = require('express');
const quoteUseCase = require('../usecases/quote.usecase');
const auth = require('../middlewares/auth.middleware');
const validateUserType = require('../middlewares/validateUserType.middleware');


const router = express.Router();

router.post('/create/car/:carId/mechanic/:mechanicId', async (req,res) => {
    const { carId, mechanicId } = req.params
    const {items} = req.body;

    try {
        const quote = await quoteUseCase.create( carId, mechanicId, items );
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

router.get('/:id', auth, validateUserType('client'), async (req, res) => {
    const { id } = req.params;
    const clientId = req.user.client._id
    try {
        const quote = await quoteUseCase.getById(id, clientId);
        res.json({
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


router.put('/calculate/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const quote = await quoteUseCase.calculateTotalById(id);
        res.json({
            success: true,
            data: { quote },
        });
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            success: false,
            error: error.message,
        });
    };
});

router.patch('/:id/reject/:repairShopQuoteId', auth, validateUserType('client'), async ( req, res) => {
    const { id, repairShopQuoteId } = req.params;
    const clientId = req.user.client._id
    try {
        const quote = await quoteUseCase.rejectRepairShopQuoteById( id, repairShopQuoteId, clientId );
        res.json({
            success: true,
            data: { quote },
        });
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            success: false,
            error: error.message,
        });
    };
});


router.post('/:id/create-checkout-session', auth, validateUserType('client'), async (req, res) => {
    const { id } = req.params;
    const clientId = req.user.client._id;
    try {
        const session = await quoteUseCase.createCheckoutSession(id, clientId);
        res.json({
            success: true,
            data: { session }
        });
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            success: false,
            error: error.message,
        })
    }
})



router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) =>{
    try {
        const result = await quoteUseCase.handleStripeEvent(req);
        res.json({
            success: true,
            data: { result }
        });
    } catch (error) {
        console.error('Error handling Stripe event:', error);
        res.status(error.status || 500);
        res.json({
            success: false,
            error: error.message,
        })
    }
});


module.exports = router;
