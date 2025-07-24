import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message =
    err instanceof AppError ? err.message : "Something went wrong";
  console.log(err);

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
