const express = require('express');
const clientUseCase = require('../usecases/client.usecase');
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware')

const router = express.Router();

router.post('/:id/car', auth, upload.single('carPicture'), async (req, res) => {
    const { id } = req.params;
    const carData = req.body    
    const file = req.file;

    try {
        const updatedClient = await clientUseCase.associateCarWithClient(id, carData, file);
        res.json({
            success: true,
            data: { client: updatedClient },
        });
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            success: false,
            error: error.message,
        });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const client = await clientUseCase.getById(id);
        res.json({
            success: true,
            data: { client },
        })
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            success: false,
            error: error.message,
        });
    }
})

module.exports = router; 