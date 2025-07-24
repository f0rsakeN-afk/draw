import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "name must contain at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must contain at least 6 characters"),
    passwordConfirm: z
      .string()
      .min(6, "Password confirm must contain at least 6 characters"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  });

export type registerSchemaData = z.infer<typeof registerSchema>;
