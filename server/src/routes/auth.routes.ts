import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import {
  register,
  verifyOTP,
  login,
  logout,
  resendOTP,
} from "../controllers/auth.controller";
import {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  resendOTPSchema,
} from "../schemas/auth.schema";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/verifyOTP", validateRequest(verifyOTPSchema), verifyOTP);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);

router.post("/resendOTP", validateRequest(resendOTPSchema), resendOTP);

export default router;
