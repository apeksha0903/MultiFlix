export type UserRole = "owner" | "member";

export interface AuthPayload {
  userId: string;
  role: UserRole;
  billingAccountId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}