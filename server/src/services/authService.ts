import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { sendEmail } from "../utils/email";
import { generateOTP } from "../utils/generateOTP";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

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

export const verifyUserOTP = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (
    !user ||
    user.otp !== otp ||
    !user.otpExpires ||
    new Date() > user.otpExpires
  ) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  await prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
      otp: null,
      otpExpires: null,
    },
  });
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid credentials", 400);

  if (!user.isVerified) throw new AppError("Email not verified", 403);

  const match = await comparePassword(password, user.password);
  if (!match) throw new AppError("Invalid credentials", 400);

  const token = generateToken(user.id);
  return token;
};
