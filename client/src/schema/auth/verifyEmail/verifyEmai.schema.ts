import { z } from "zod";

export const verifyEmailSchema = z.object({
  otp: z.string().min(6, "OTP must have 6 characters"),
});

export type verifyEmailData = z.infer<typeof verifyEmailSchema>;
