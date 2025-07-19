import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must contain at least 6 characters"),
    passwordConfirm: z
      .string()
      .min(6, "Password Confirm must contain at least 6 characters"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Password and password confirm must be same",
  });

export type resetPasswordData = z.infer<typeof resetPasswordSchema>;
