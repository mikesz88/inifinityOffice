import { Router } from 'express';
import {
  validateRequest,
  validateRequestBody,
  validateRequestQuery,
} from 'zod-express-middleware';
import {
  loginUserZObject,
  registerUserZObject,
  updateUserZObject,
  updateUserPasswordZObject,
  updateUserForgotZObject,
  getForgotQuestionWithEmailQueryZObject,
  matchForgotPasswordPasswordAnswerZObject,
  resetPasswordZObject,
} from '../zod/auth.types';

const {
  registerUser,
  getLoggedInUser,
  login,
  logout,
  update,
  updatePassword,
  updateForgot,
  getForgotQuestion,
  forgotAnswer,
  resetPassword,
  deleteSelf,
} = require('../controllers/auth');

const { protect } = require('../middleware/auth');

const router = Router();

router.post(
  '/register',
  validateRequestBody(registerUserZObject),
  registerUser
);

router.post('/login', validateRequestBody(loginUserZObject), login);
router.get('/logout', protect, logout);

router.get('/me', protect, getLoggedInUser);
router.patch(
  '/update',
  validateRequestBody(updateUserZObject),
  protect,
  update
);
router.patch(
  '/updatePassword',
  validateRequestBody(updateUserPasswordZObject),
  protect,
  updatePassword
);
router.patch(
  '/updateForgot',
  validateRequestBody(updateUserForgotZObject),
  protect,
  updateForgot
);
router.get(
  '/forgotQuestion',
  validateRequestQuery(getForgotQuestionWithEmailQueryZObject),
  getForgotQuestion
);
router.post(
  '/forgotAnswer',
  validateRequestBody(matchForgotPasswordPasswordAnswerZObject),
  forgotAnswer
);
router.put(
  '/resetPassword',
  validateRequest(resetPasswordZObject),
  resetPassword
);
router.delete('/deleteSelf', protect, deleteSelf);

module.exports = router;
