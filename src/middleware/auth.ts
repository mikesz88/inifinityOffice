import { Request, Response, NextFunction } from 'express';
import db from '../../prisma/db.setup';
import { getDataFromAuthToken } from '../utils/auth';
import asyncHandler from './asyncHandler';

exports.protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const [, token] = req.headers.authorization?.split?.(' ') || [];

    const myJwtData = getDataFromAuthToken(token);

    if (!myJwtData) {
      return res.status(401).json({ success: false, message: 'Invalid Token' });
    }

    const userFromJwt = await db.user.findUnique({
      where: {
        id: myJwtData.id,
      },
    });

    if (!userFromJwt) {
      return res
        .status(401)
        .json({ success: false, message: 'Authentication failed' });
    }

    req.user = userFromJwt;
    next();
  }
);

exports.NOTSuperAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user!.role === 'SUPERADMIN') {
      return res.status(401).json({
        success: false,
        message:
          'Authentication failed. You cannot be a Super Admin. You do not have a designated business assigned to you.',
      });
    }
    next();
  }
);

exports.superAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user!.role !== 'SUPERADMIN') {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Super Admin Access Only.',
      });
    }
    next();
  }
);
