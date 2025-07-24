import rateLimit from "express-rate-limit";

export const authRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many requests. Please try again later.",
  legacyHeaders: true,
  standardHeaders: true,
});
