import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    passwordConfirm: z.string().min(6),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Password and password confirm are not the same",
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password should contain at least 6 character"),
});

export const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const resendOTPSchema = z.object({
  email: z.string().email(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string(),
  newPassword: z.string().min(6),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
