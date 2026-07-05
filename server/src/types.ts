export type UserRole = "owner" | "member";

export interface AuthPayload {
  userId: string;
  role: UserRole;
  billingAccountId: string;
  email?: string;
}

declare global {
  namespace Express {
    interface User extends AuthPayload {
      token?: string;
    }
  }
}

export {};
