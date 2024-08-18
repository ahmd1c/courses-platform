import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import authRouter from "./auth/auht_router";
import userRouter from "./users/usersRouter";
import coursesRouter from "./courses/courses-router";
import { stripeWebhookController } from "./controllers/stripe-webhook-controller";
import { errorMiddleware, notFound } from "./errorHandler/error-middleware";
import categoryRouter from "./category/category_router";

dotenv.config();

const app = express();
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
});

app.use(limiter);

app.use(
  "api/v1/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController
);

app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === process.env.CLIENT_URL!) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/categories", categoryRouter);

app.use(errorMiddleware);
app.use(notFound);

app.listen(process.env.PORT, () =>
  console.log(`Server Is Listening on port ${process.env.PORT}`)
);
