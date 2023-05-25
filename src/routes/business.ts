import { Router } from 'express';
import { validateRequestBody } from 'zod-express-middleware';
import {
  createBusinessZObject,
  updateBusinessZObject,
} from '../zod/business.types';

const {
  allBusinessCodes,
  createBusiness,
  updateBusiness,
  allBusinesses,
  getBusiness,
} = require('../controllers/business');

const { protect, superAdmin, NOTSuperAdmin } = require('../middleware/auth');
const { businessOwner } = require('../middleware/business');

const router = Router();

router.get('/codes', allBusinessCodes);
router.get('/', protect, superAdmin, allBusinesses);
router.post('/', validateRequestBody(createBusinessZObject), createBusiness);
router.patch(
  '/',
  validateRequestBody(updateBusinessZObject),
  protect,
  businessOwner,
  updateBusiness
);
router.get('/me', protect, NOTSuperAdmin, getBusiness);

module.exports = router;
