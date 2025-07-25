import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { verifyToken } from "../utils/jwt";

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
