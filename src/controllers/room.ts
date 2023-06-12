import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import db from '../../prisma/db.setup';
import socketApi from '../socket/socket';

let typingUsers: { [T: string]: string } = {};

// * @desc getMessages
// * @route GET /api/v1/channel/messages/:id
// * @access PRIVATE
exports.getMessages = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const room = await db.room.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!room) {
      return res
        .status(400)
        .json({ success: false, message: 'There is no room with that id.' });
    }

    const messages = await db.message.findMany({
      where: {
        roomId: req.params.id as string,
      },
    });

    res.status(200).json({ success: true, data: messages });
  }
);
