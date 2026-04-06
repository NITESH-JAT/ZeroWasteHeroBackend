import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import * as authRepo from './authRepository';
import { JwtPayload } from './authTypes';
import { uploadBufferToCloudinary } from '../../utils/cloudinaryHelper';

export const registerUser = async (data: any) => {
  // 1. Check if user already exists
  const existingUser = await authRepo.findUserByEmail(data.email);
  if (existingUser) {
    throw new Error('Email is already registered');
  }

  // 2. Hash the password securely
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  // 3. Upload the Gov ID if they are a Scrapper!
  let govIdUrl: string | undefined = undefined;
  
  if (data.role === 'SCRAPPER' && data.govIdBuffer) {
    // We use your custom helper to upload to a specific folder
    govIdUrl = await uploadBufferToCloudinary(data.govIdBuffer, 'zero-waste-govid');
  }

  // 4. Save to database
  const newUser = await authRepo.createUser({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    passwordHash,
    role: data.role,
    govIdUrl // This is now the live Cloudinary URL (or undefined for Citizens)
  });

  // 5. Generate JWT
  const token = generateToken({ userId: newUser.id, role: newUser.role });

  return { user: newUser, token };
};

export const loginUser = async (email: string, password: string) => {
  // 1. Find user by email
  const user = await authRepo.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // 2. Verify password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // 3. Generate JWT
  const token = generateToken({ userId: user.id, role: user.role });

  // Remove passwordHash from the return object for security
  const { passwordHash, ...safeUser } = user;
  
  return { user: safeUser, token };
};

// Helper function
const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET as string;
  
  // Cast the string to the exact type jsonwebtoken expects
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
  
  return jwt.sign(payload, secret, { expiresIn });
};