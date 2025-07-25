import prisma from "../lib/prisma";
import crypto from "crypto";
import { AppError } from "../utils/AppError";
import { sendEmail } from "../utils/email";
import { generateOTP } from "../utils/generateOTP";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { generateResetToken } from "../utils/generateToken";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  const now = new Date();

  if (existingUser && existingUser.isVerified) {
    throw new AppError("User already registered. Please login.", 400);
  }

  if (existingUser && !existingUser.isVerified) {
    const now = new Date();

    const diffInSeconds =
      (now.getTime() - new Date(existingUser.otpSentAt || 0).getTime()) / 1000;

    if (diffInSeconds < 60) {
      throw new AppError("Please wait before requesting a new OTP.", 429);
    }

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpires },
    });

    await sendEmail(email, "Your new OTP Code", `Your new OTP is ${otp}`);

    return { message: "New OTP sent to your email" };
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    },
  });

  await sendEmail(email, "Verify your email", `Your OTP is ${otp}`);

  return { message: "User registered. Please verify your email." };
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

export const resendOTPService = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new AppError("User not found", 404);

  if (user.isVerified)
    throw new AppError("User already verified. Please login.", 400);

  const now = new Date();

  const diffInSeconds =
    (now.getTime() - new Date(user.otpSentAt || 0).getTime()) / 1000;

  if (diffInSeconds < 60) {
    throw new AppError("Please wait before requesting a new OTP.", 429);
  }

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({ where: { email }, data: { otp, otpExpires } });

  await sendEmail(email, "Your OTP code", `Your new OTP is:${otp}`);

  return { message: "OTP resent to your mail." };
};

export const logoutUser = async () => {
  return { message: "Logged out successfully" };
};

export const forgotPasswordService = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new AppError("User not found", 404);

  const { resetToken, hashedToken } = generateResetToken();
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: expires,
    },
  });

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;

  await sendEmail(
    email,
    "Password Reset Request",
    `Click the following link to reset your password: ${resetLink}`
  );

  return { message: "Reset link sent to your mail" };
};

export const resetPasswordService = async (
  email: string,
  token: string,
  newPassword: string
) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      email,
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { gt: new Date() },
    },
  });

  if (!user) throw new AppError("Invalid or expired token", 400);

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpires: null,
    },
  });

  return { message: "Password reset successfully" };
};

export const updatePasswordService = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);

  const match = await comparePassword(oldPassword, user.password);
  if (!match) throw new AppError("Invalid password", 400);

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password updated successfully" };
};
