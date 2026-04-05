export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface JwtPayload {
  userId: string;
  role: string;
}

export interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: string;
  greenPoints: number;
}