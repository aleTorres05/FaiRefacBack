const express = require('express');
const carUseCase = require('../usecases/car.usecase');
const auth = require('../middlewares/auth.middleware');


const router = express.Router();

router.get('/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const car = await carUseCase.getById(id);
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