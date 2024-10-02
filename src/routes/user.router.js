const express = require('express');
const userUseCase = require('../usecases/user.usecase');
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');


const router = express.Router();

router.get('/:id', async (req,res) => {
    const { id } =req.params;
    try {
        const user = await userUseCase.getById(id);
        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            success: false,
            error: error.message,
        });
    }
})

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

router.patch('/:id/client', auth, upload.single('profilePicture'), async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const file = req.file
    
    try {
        const updatedUser = await userUseCase.updateByIdUserClient(id, req.body, userId, file);
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

router.patch('/:id/repairShop', auth, upload.single('profilePicture'), async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const file = req.file
    
    try {
        const updatedUser = await userUseCase.updateByIdUserRepairShop(id, req.body, userId, file);
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