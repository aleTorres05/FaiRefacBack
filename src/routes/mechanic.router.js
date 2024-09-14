const express = require('express');
const mechanicUseCase = require('../usecases/mechanic.usecase');

const router = express.Router();

router.get('/', async (req,res) => {
    try {
        const allMechanics = await mechanicUseCase.getAll();
        res.json({
            success: true,
            data: { Mechanics: allMechanics },
        });
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            success: false,
            error: error.message,
        });
    }
});

router.post('/', async (req,res) => {
    try {
        const createdMechanic = await mechanicUseCase.create(req.body);
        res.json({
            success: true,
            data: { Mechanic: createdMechanic },
        })
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            success: false,
            error: error.message,
        });
    }
});

module.exports = router;