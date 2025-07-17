import express from "express";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(errorMiddleware);

export default app;
