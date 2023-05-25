import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import db from '../../prisma/db.setup';
import { RegisterUser } from '../zod/auth.types';
import {
  saltValue,
  matchSaltedValue,
  getResetPasswordToken,
  sendTokenResponse,
} from '../utils/auth';
import crypto from 'crypto';

const privateOfficeTypes = [
  {
    role: 'USER',
    name: 'User Office',
    description: 'Max 4',
    capacity: 4,
  },
  {
    role: 'MANAGER',
    name: 'Manager Office',
    description: 'Max 6',
    capacity: 6,
  },
  {
    role: 'COMPANYADMIN',
    name: 'Admin Office',
    description: 'Max 8',
    capacity: 8,
  },
  {
    role: 'OWNER',
    name: 'Owner Office',
    description: 'Max 10',
    capacity: 10,
  },
];

// * @desc Register User
// * @route POST /api/v1/auth/register
// * @access PUBLIC
exports.registerUser = asyncHandler(async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    displayName,
    email,
    role,
    businessCode,
    password,
    forgotPasswordQuestion,
    forgotPasswordAnswer,
  }: RegisterUser = req.body;

  const business = await db.business.findUnique({
    where: {
      code: businessCode,
    },
    select: {
      id: true,
    },
  });

  if (!business) {
    return res
      .status(404)
      .json({ success: false, message: 'Business Code not found.' });
  }

  const user = await db.user.create({
    data: {
      firstName,
      lastName,
      email,
      role,
      businessId: business.id,
      displayName: displayName ? displayName : firstName + ' ' + lastName,
    },
  });

  await db.password.create({
    data: {
      password: await saltValue(password),
      userId: user.id,
    },
  });

  await db.forgotPassword.create({
    data: {
      forgotPasswordQuestion,
      forgotPasswordAnswer: await saltValue(forgotPasswordAnswer),
      userId: user.id,
    },
  });

  for (const officeType of privateOfficeTypes) {
    if (user.role === officeType.role) {
      await db.room.create({
        data: {
          name: officeType.name,
          description: officeType.description,
          businessId: user.businessId,
          userId: user.id,
          capacity: officeType.capacity,
        },
      });
    }
  }

  sendTokenResponse(user.id, 201, res);
});

// * @desc Login User
// * @route POST /api/v1/auth/login
// * @access PUBLIC
exports.login = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email and/or Password is incorrect.',
      });
    }

    const userHashedPassword = await db.password.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        password: true,
      },
    });

    const isMatch = await matchSaltedValue(
      password,
      userHashedPassword!.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email and/or Password is incorrect.',
      });
    }

    sendTokenResponse(user.id, 200, res);
  }
);

// * @desc Logout in User
// * @route GET /api/v1/auth/logout
// * @access PRIVATE
exports.logout = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    res.cookie('token', '', {
      expires: new Date(Date.now() + 0.1 * 1000),
      sameSite: false,
    });

    res.status(200).json({
      success: true,
      message: 'You have successfully logged out.',
    });
  }
);

// * @desc Get logged in User
// * @route GET /api/v1/auth/me
// * @access PRIVATE
exports.getLoggedInUser = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await db.user.findUnique({
      where: { id: req.user!.id },
      include: {
        forgotPassword: {
          select: {
            forgotPasswordQuestion: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// * @desc Update User details
// * @route PATCH /api/v1/auth/update
// * @access PRIVATE
exports.update = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      displayName: req.body.displayName,
      email: req.body.email,
      businessCode: req.body.businessCode,
    };

    const user = await db.user.update({
      where: {
        id: req.user!.id,
      },
      data: fieldsToUpdate,
    });

    res.status(200).json({ success: true, data: user });
  }
);

// * @desc Update User password
// * @route PATCH /api/v1/auth/updatePassword
// * @access PRIVATE
exports.updatePassword = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message:
          'Current Password and New Password cannot be the same. Please change your new password.',
      });
    }

    const currentHashedPassword = await db.password.findUnique({
      where: { userId: req.user!.id },
    });

    const isMatched = await matchSaltedValue(
      currentPassword,
      currentHashedPassword!.password
    );

    if (!isMatched) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid Password.' });
    }

    await db.password.update({
      where: {
        userId: req.user!.id,
      },
      data: {
        password: await saltValue(newPassword),
      },
    });

    res
      .status(200)
      .json({ success: true, message: 'Password successfully updated.' });
  }
);

// * @route PUT /api/v1/auth/updateForgot
// * @desc Update Forgot Question & Answer
// * @access PRIVATE
exports.updateForgot = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const {
      currentForgotPasswordAnswer,
      newForgotPasswordQuestion,
      newForgotPasswordAnswer,
    } = req.body;

    const forgotPassword = await db.forgotPassword.findUnique({
      where: {
        userId: req.user!.id,
      },
    });

    const isMatched = await matchSaltedValue(
      currentForgotPasswordAnswer,
      forgotPassword!.forgotPasswordAnswer
    );

    if (!isMatched) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid Forgot Password Answer.' });
    }

    await db.forgotPassword.update({
      where: {
        userId: req.user!.id,
      },
      data: {
        forgotPasswordQuestion: newForgotPasswordQuestion,
        forgotPasswordAnswer: await saltValue(newForgotPasswordAnswer),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Forgot Password Question and Answer Updated.',
    });
  }
);

// * @route GET /api/v1/auth/forgotQuestion/:email
// * @desc GET Forgot Password Question
// * @access PUBLIC
exports.getForgotQuestion = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await db.user.findUnique({
      where: {
        email: req.query.email as string,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'There is no user with that email.' });
    }

    const forgotQuestion = await db.forgotPassword.findUnique({
      where: {
        userId: user.id,
      },
    });

    res
      .status(200)
      .json({ success: true, data: forgotQuestion!.forgotPasswordQuestion });
  }
);

// * @route POST /api/v1/auth/forgotAnswer
// * @desc Validate Forgot Password Answer
// * @access PUBLIC
exports.forgotAnswer = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, forgotAnswer } = req.body;
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'There is no user with that email.' });
    }

    const forgotPassword = await db.forgotPassword.findUnique({
      where: {
        userId: user.id,
      },
    });

    const isMatch = await matchSaltedValue(
      forgotAnswer,
      forgotPassword!.forgotPasswordAnswer
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Forgot Password Answer is incorrect.',
      });
    }

    const { resetPasswordToken, resetToken } = getResetPasswordToken();

    await db.resetPassword.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await db.resetPassword.create({
      data: {
        resetPasswordToken,
        userId: user.id,
      },
    });

    res.status(200).json({
      success: true,
      data: resetToken,
    });
  }
);

// * @route PUT /api/v2/auth/resetPassword/:resetToken
// * @desc reset password
// * @access PUBLIC
exports.resetPassword = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { password } = req.body;

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.query.resetToken as string)
      .digest('hex');

    const resetUser = await db.resetPassword.findUnique({
      where: { resetPasswordToken },
    });

    if (!resetUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid token.' });
    }

    const actualResetDate =
      new Date(resetUser!.resetPasswordExpired).getTime() + 10 * 60 * 1000;
    const isBeforeTimeLimit = actualResetDate > Date.now();

    if (!isBeforeTimeLimit) {
      return res
        .status(400)
        .json({ success: false, message: 'Expired token.' });
    }

    const user = await db.user.findUnique({
      where: { id: resetUser!.userId },
    });

    await db.password.update({
      where: { userId: user!.id },
      data: {
        password: await saltValue(password),
      },
    });

    await db.resetPassword.delete({ where: { resetPasswordToken } });

    sendTokenResponse(user!.id, 200, res);
  }
);

// * @route DELETE /api/v2/auth/deleteSelf
// * @desc Delete Self
// * @access PRIVATE
exports.deleteSelf = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    await db.user.delete({ where: { id: req.user!.id } });

    res.status(200).json({
      success: true,
      message: 'Your account has been officially deleted.',
    });
  }
);
