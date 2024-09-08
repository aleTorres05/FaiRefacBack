const express = require('express');
const userUseCase = require('../usecases/user.usecase');
const auth = require('../middlewares/auth.middleware');

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

router.patch('/:id/client', auth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    
    try {
        const updatedUser = await userUseCase.updateByIdUserClient(id, req.body, userId);
        res.json({
            success: true,
            data: { user: updatedUser },
        });
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            success: false,
            error: error.message,
        });
    }
});

module.exports = router;