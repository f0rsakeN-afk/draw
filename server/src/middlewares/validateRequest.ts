import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors.map((e: any) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }
  };
