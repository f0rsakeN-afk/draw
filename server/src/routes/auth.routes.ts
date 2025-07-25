import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import {
  register,
  verifyOTP,
  login,
  logout,
  resendOTP,
  forgotPassword,
  resetPassword,
  updatePassword,
  getMe,
} from "../controllers/auth.controller";
import {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  resendOTPSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} from "../schemas/auth.schema";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/verifyOTP", validateRequest(verifyOTPSchema), verifyOTP);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);
router.post("/resendOTP", validateRequest(resendOTPSchema), resendOTP);
router.post(
  "/forgotpassword",
  validateRequest(forgotPasswordSchema),
  forgotPassword
);
router.post(
  "/resetpassword",
  validateRequest(resetPasswordSchema),
  resetPassword
);

router.use(protect);

router.post(
  "updatepassword",
  validateRequest(updatePasswordSchema),
  updatePassword
);

router.get("/me", getMe);

export default router;
