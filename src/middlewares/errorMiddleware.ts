import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/apiResponse';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error] ${err.message}`, err.stack);

  const statusCode = 500;
  const message = process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error';

  return errorResponse(res, statusCode, message);
};