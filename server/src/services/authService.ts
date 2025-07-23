import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { sendEmail } from "../utils/email";
import { generateOTP } from "../utils/generateOTP";
import { hashPassword } from "../utils/hash";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  passwordConfirm: string
) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError("Email already registered", 400);

  const hashed = await hashPassword(password);
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.create({
    data: { email, password: hashed, name, otp, otpExpires },
  });

  await sendEmail(email, "Verify your email", `Your OTP is ${otp}`);
};


