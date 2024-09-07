const express = require('express');
const userUseCase = require('../usecases/user.usecase');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const createdUser = await userUseCase.create(req.body);
        res.json({
            success: true,
            data: { User: createdUser},
        })
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            success: false,
            error: error.message,
        });
    };
});

module.exports = router;