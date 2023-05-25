import { Request, Response, NextFunction } from 'express';

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => void) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch((e) => {
      res.status(400).json({ success: false, error: e, message: e.message });
      next();
    });

// module.exports = asyncHandler;
export default asyncHandler;
