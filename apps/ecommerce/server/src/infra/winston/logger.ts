import winston from "winston";
import path from "path";

const logDir = process.env.LOG_DIR || path.resolve(process.cwd(), "logs");
const shouldWriteFileLogs = process.env.VERCEL !== "1";

const logFormat = winston.format.printf(
  (info: winston.Logform.TransformableInfo) => {
    return `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`;
  }
);

const transports: winston.transport[] = [new winston.transports.Console()];

if (shouldWriteFileLogs) {
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  );
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    logFormat
  ),
  transports,
});

if (shouldWriteFileLogs) {
  logger.exceptions.handle(
    new winston.transports.File({
      filename: path.join(logDir, "exceptions.log"),
    })
  );
}

export default logger;
