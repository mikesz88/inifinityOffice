import { Router } from 'express';

const { connect } = require('../controllers/socket');

const { protect } = require('../middleware/auth');

const router = Router();

router.get('/', /* protect, */ connect);

module.exports = router;
