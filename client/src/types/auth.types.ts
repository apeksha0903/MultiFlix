export type UserRole = 'owner' | 'member';

export interface User {
  id: string;
  _id?: string;
  email: string;
  role: UserRole;
  displayName?: string;
  avatarStyle?: string;
  onboardingComplete: boolean;
  createdAt?: string;
  isGoogleUser?: boolean;
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
