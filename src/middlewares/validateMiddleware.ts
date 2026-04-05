import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { errorResponse } from '../utils/apiResponse';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next(); 
    } catch (error: any) {
      if (error instanceof ZodError) {
        // By casting to 'any' here, we bypass the generic strictness safely
        const validationErrors = (error as any).errors || (error as any).issues;
        
        const errorMessages = validationErrors.map((err: any) => `${err.path.join('.')}: ${err.message}`);
        return errorResponse(res, 400, 'Validation Failed', errorMessages);
      }
      next(error);
    }
  };
};