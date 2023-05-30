import { Router } from 'express';

const { getMessages } = require('../controllers/channel');

const { protect } = require('../middleware/auth');

const router = Router();

router.get('/messages/:id', /* protect, */ getMessages);

module.exports = router;
