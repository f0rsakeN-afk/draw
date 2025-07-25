import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { verifyToken } from "../utils/jwt";

type UserRole = 'user' | 'admin' | 'superadmin';

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.vizion;

    if (!token) throw new AppError("Not logged in", 401);

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new AppError("User no longer exists", 401);
    if (!user.isVerified) throw new AppError("Please verify your email", 401);

    req.user = user;

    next();
  }
);

/**
 * Restrict access to specific roles
 * @param roles - Array of roles that are allowed to access the route
 * @returns Middleware function
 */
export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user is set by the protect middleware
    if (!req.user) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};
