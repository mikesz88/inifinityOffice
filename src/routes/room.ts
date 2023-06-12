import { Router } from 'express';
import { validateRequestParams } from 'zod-express-middleware';
import { getChannelMessagesQueryZObject } from '../zod/room.types';

const { getMessages } = require('../controllers/room');

const { protect } = require('../middleware/auth');

const router = Router();

router.get(
  '/messages/:id',
  validateRequestParams(getChannelMessagesQueryZObject),
  protect,
  getMessages
);

module.exports = router;
