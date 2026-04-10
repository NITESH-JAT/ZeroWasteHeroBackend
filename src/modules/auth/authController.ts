import { Request, Response, NextFunction } from 'express';
import * as authService from './authService';
import { successResponse, errorResponse } from '../../utils/apiResponse';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    
    // Grab the raw image data from memory!
    const govIdBuffer = req.file?.buffer;

    // SECURITY LOCKDOWN: Define exactly which roles can be created publicly
    const allowedPublicRoles = ['CITIZEN', 'NGO', 'WORKER', 'SCRAPPER'];
    
    // If they try to pass garbage text, we force them to be a CITIZEN
    let safeRole = 'CITIZEN';
    if (role && allowedPublicRoles.includes(role.toUpperCase())) {
      safeRole = role.toUpperCase();
    }

    // Check if the validated role is a Scrapper and ensure they attached a Buffer
    if (safeRole === 'SCRAPPER' && !govIdBuffer) {
      return errorResponse(res, 400, 'Government ID image is required for Scrap Collectors');
    }

    const result = await authService.registerUser({ 
      firstName, 
      lastName, 
      email, 
      password, 
      role: safeRole,
      govIdBuffer
    });
    
    return successResponse(res, 201, 'User registered successfully', result);
  } catch (error: any) {
    if (error.message === 'Email is already registered') {
      return errorResponse(res, 409, error.message);
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);
    
    return successResponse(res, 200, 'Login successful', result);
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      return errorResponse(res, 401, error.message);
    }
    next(error);
  }
};