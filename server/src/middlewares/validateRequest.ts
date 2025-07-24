import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../utils/AppError";

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const { fieldErrors, formErrors } = result.error.flatten();

      // @ts-ignore
      const firstFieldError = Object.values(fieldErrors)[0]?.[0];
      const firstFormError = formErrors[0];

      const message = firstFieldError || firstFormError || "Validation error";

      return next(new AppError(message, 400));
    }

    req.body = result.data;

    next();
  };
