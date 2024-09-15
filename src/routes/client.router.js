const express = require('express');
const clientUseCase = require('../usecases/client.usecase');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/:clientId/car', auth, async (req, res) => {
    const { clientId } = req.params;

    try {
        const updatedClient = await clientUseCase.associateCarWithClient(clientId, req.body);
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