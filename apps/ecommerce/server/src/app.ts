import express from "express";
import dotenv from "dotenv";
import "./infra/cloudinary/config";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";
import logger from "./infra/winston/logger";
import compression from "compression";
import passport from "passport";
import session from "express-session";
import { RedisStore } from "connect-redis";
import redisClient, {
  isUsingMemoryRedis,
  redisSessionClient,
} from "./infra/cache/redis";
import configurePassport from "./infra/passport/passport";
import { cookieParserOptions } from "./shared/constants";
import globalError from "./shared/errors/globalError";
import { logRequest } from "./shared/middlewares/logRequest";
import { configureRoutes } from "./routes";
import { configureGraphQL } from "./graphql";
import webhookRoutes from "./modules/webhook/webhook.routes";
import healthRoutes from "./routes/health.routes";
// import { preflightHandler } from "./shared/middlewares/preflightHandler";
import { Server as HTTPServer } from "http";
import { SocketManager } from "@/infra/socket/socket";
import { connectDB } from "./infra/database/database.config";
import { setupSwagger } from "./docs/swagger";
import { getAllowedOrigins } from "./config/cors";

dotenv.config();

export const createApp = async () => {
  const app = express();

  if (process.env.SKIP_DB_CONNECT !== "true") {
    await connectDB().catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    });
  } else {
    logger.warn("Skipping database connection because SKIP_DB_CONNECT=true.");
  }

  const httpServer = new HTTPServer(app);

  // Initialize Socket.IO
  const socketManager = new SocketManager(httpServer);
  const io = socketManager.getIO();

  // Swagger Documentation
  setupSwagger(app);

  // Health check routes (no middleware applied)
  app.use("/", healthRoutes);

  // Basic
  app.use(
    "/api/v1/webhook",
    bodyParser.raw({ type: "application/json" }),
    webhookRoutes
  );
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET, cookieParserOptions));

  app.set("trust proxy", 1);
  const sessionSecret =
    process.env.SESSION_SECRET || "local-development-session-secret";

  if (isUsingMemoryRedis) {
    logger.warn("Using in-memory sessions because REDIS_URL is not set.");
  }

  app.use(
    session({
      store: redisSessionClient
        ? new RedisStore({ client: redisSessionClient })
        : undefined,
      secret: sessionSecret,
      resave: false,
      saveUninitialized: true, // Keeps guest sessionId from the first request
      proxy: true, // Ensures secure cookies work with proxy
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in prod
        sameSite: "none", // Required for cross-site cookies
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  configurePassport();

  // Preflight handler removed to avoid conflicts

  // CORS must be applied BEFORE GraphQL setup
  app.use(
    cors({
      origin: getAllowedOrigins(),
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Apollo-Require-Preflight", // For GraphQL
      ],
    })
  );

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  app.use(helmet.frameguard({ action: "deny" }));

  // Extra Security
  app.use(ExpressMongoSanitize());
  app.use(
    hpp({
      whitelist: ["sort", "filter", "fields", "page", "limit"],
    })
  );

  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );
  app.use(compression());
  app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"), {
      maxAge: "1d",
    }),
  );

  app.use("/api", configureRoutes(io));

  // GraphQL setup
  await configureGraphQL(app);

  // Error & Logging
  app.use(globalError);
  app.use(logRequest);

  return { app, httpServer };
};
