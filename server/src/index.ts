import express from "express";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import { authRateLimit } from "./utils/rateLimit";
import subscriptionRoutes from "./routes/subscription.routes";
import videoRoutes from "./routes/video.routes";
import categoryRoutes from "./routes/category.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(authRateLimit);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/categories", categoryRoutes);

app.use(errorMiddleware);

export default app;
