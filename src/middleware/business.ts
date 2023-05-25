import { Request, Response, NextFunction } from 'express';
import db from '../../prisma/db.setup';
import asyncHandler from './asyncHandler';
import { Business } from '@prisma/client';

exports.businessOwner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user!.role !== 'OWNER' && req.user!.role !== 'SUPERADMIN') {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Business Owner Access Only.',
      });
    } else if (req.user!.role === 'OWNER') {
      const business = (await db.business.findUnique({
        where: {
          id: req.user!.businessId!,
        },
      })) as Business;
      req.business = business;
    }
    next();
  }
);
