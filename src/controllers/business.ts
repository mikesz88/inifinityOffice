import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import db from '../../prisma/db.setup';
import { Business } from '@prisma/client';

// * @desc Create a Business
// * @route POST /api/v1/business
// * @access PUBLIC
/**
 * @swagger
 * /api/v1/business:
 *   post:
 *     summary: Create a Business
 *     description: Endpoint to create a new business.
 *     tags:
 *       - Business
 *     requestBody:
 *       description: Business data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBusinessRequest'
 *           example:
 *             name: Example Business
 *             officeType: Skyline
 *     responses:
 *       201:
 *         description: Business created successfully
 * components:
 *   schemas:
 *     CreateBusinessRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         officeType:
 *           type: string
 *       required:
 *         - name
 *         - officeType
 */

exports.createBusiness = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { name, officeType } = req.body;

    let code: string = '';

    for (let index = 0; index < 6; index++) {
      const num = Math.floor(Math.random() * 10);
      code += num;
    }
    const business = await db.business.create({
      data: {
        code,
        name,
        officeType,
      },
    });

    res.status(201).json({ success: true, data: business });
  }
);

// * @desc Update Business Name, Code, or Office Type
// * @route PATCH /api/v1/business
// * @access PRIVATE && OWNER/SUPERADMIN ONLY
exports.updateBusiness = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    let business: Business | null;
    if (req.user!.role === 'SUPERADMIN') {
      if (!req.body.businessId) {
        return res.status(400).json({
          success: false,
          message:
            'As a Super Admin User, you need to provide the Business Id in the body.',
        });
      }

      business = await db.business.findUnique({
        where: { id: req.body.businessId },
      });
    } else {
      business = await db.business.findUnique({
        where: { id: req.business!.id },
      });
    }
    const fieldsToUpdate = {
      code: req.body.code,
      name: req.body.name,
      officeType: req.body.officeType,
    };

    const businesses = await db.business.findMany();

    if (req.body.code) {
      const businessCodes = businesses.map((business) => business.code);

      const isValidCode = !businessCodes.includes(req.body.code);

      if (!isValidCode) {
        return res.status(400).json({
          success: false,
          message:
            'The business code must be unique and not the same as before.',
        });
      }
    }

    if (req.body.name) {
      const businessNames = businesses.map((business) =>
        business.name.toLowerCase()
      );

      const isValidName = !businessNames.includes(req.body.name.toLowerCase());

      if (!isValidName) {
        return res.status(400).json({
          success: false,
          message:
            'The business name must be unique and cannot be the same as before.',
        });
      }
    }

    if (req.body.officeType) {
      const currentBusiness = await db.business.findUnique({
        where: { id: business!.id },
      });

      const isValidOffice = req.body.officeType !== currentBusiness!.officeType;

      if (!isValidOffice) {
        return res.status(400).json({
          success: false,
          message: 'The business office type cannot be the same as before.',
        });
      }
    }

    const updateBusiness = await db.business.update({
      where: {
        id: business!.id,
      },
      data: fieldsToUpdate,
    });

    res.status(200).json({ success: true, data: updateBusiness });
  }
);

// * @desc List of Business Codes
// * @route GET /api/v1/business/codes
// * @access PUBLIC
exports.allBusinessCodes = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const businesses = await db.business.findMany();

    const businessCodes = businesses.map((business) => business.code);

    res.status(200).json({ success: true, data: businessCodes });
  }
);

// * @desc get all businesses info
// * @route GET /api/v1/business
// * @access PRIVATE && SUPERADMIN only
exports.allBusinesses = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const businesses = await db.business.findMany();

    res.status(200).json({ success: true, data: businesses });
  }
);

// * @desc get user's own business info
// * @route GET /api/v1/business/me
// * @access Non Super Admin Access (Super Admin does not have designated business)
exports.getBusiness = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const business = await db.business.findUnique({
      where: { id: req.user!.businessId! },
    });

    res.status(200).json({ success: true, data: business });
  }
);
