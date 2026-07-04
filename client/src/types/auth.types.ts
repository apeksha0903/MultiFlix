export type UserRole = 'owner' | 'member';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
  billingAccountId: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
}
