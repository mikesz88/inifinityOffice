import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import db from '../../prisma/db.setup';
import socketApi from '../socket/socket';

let typingUsers: { [T: string]: string } = {};

// * @desc getMessages
// * @route GET /api/v1/channel/messages/:id
// * @access PUBLIC
exports.getMessages = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const messages = await db.message.findMany({
      where: {
        roomId: req.query.id as string,
      },
    });

    // console.log({ messages });

    res.status(200).json({ success: true, data: messages });
  }
);
