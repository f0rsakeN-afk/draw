import express from "express";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import { authRateLimit } from "./utils/rateLimit";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(authRateLimit);
app.use("/api/v1/auth", authRoutes);

app.use(errorMiddleware);

export default app;
