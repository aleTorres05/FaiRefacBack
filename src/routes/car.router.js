const express = require('express');
const carUseCase = require('../usecases/car.usecase');
const auth = require('../middlewares/auth.middleware');
const validateUserType = require('../middlewares/validateUserType.middleware');


const router = express.Router();

router.get('/:id', auth, validateUserType('client'), async (req, res) => {
    const { id } = req.params;
    const clientId = req.user.client._id

    try {
        const car = await carUseCase.getById(id, clientId);
        res.json({
            success: true,
            data: { car },
        });
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;