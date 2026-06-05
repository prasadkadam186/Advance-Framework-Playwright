import path from "node:path";
import winston, { Logger as WinstonLogger } from "winston";

/**
 * Centralised Winston logger.
 *
 * Usage:
 *   import { logger, getLogger } from "@utils/Logger";
 *
 *   logger.info("plain message");
 *
 *   // Scoped logger that prefixes every line with a context label:
 *   const log = getLogger("BasePage");
 *   log.info("navigated to home page");   // => [BasePage] navigated to home page
 */

const LOG_DIR = path.resolve(process.cwd(), "logs");
const LOG_LEVEL = process.env.LOG_LEVEL ?? "info";

// Purpose : Human-readable console line, e.g. "2026-06-05 10:30:00 [info] [BasePage] message"
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message, context }) => {
        const scope = context ? `[${String(context)}] ` : "";
        return `${String(timestamp)} ${level} ${scope}${String(message)}`;
    }),
);

// Purpose : Structured JSON for the persisted log files (easier to parse later)
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
);

export const logger: WinstonLogger = winston.createLogger({
    level: LOG_LEVEL,
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new winston.transports.File({
            filename: path.join(LOG_DIR, "combined.log"),
            format: fileFormat,
        }),
        new winston.transports.File({
            filename: path.join(LOG_DIR, "error.log"),
            level: "error",
            format: fileFormat,
        }),
    ],
});

/**
 * Purpose : Return a child logger that tags every message with a context label.
 * Pass the class name (e.g. "BasePage", "UiElementLocator") so logs are traceable.
 */
export function getLogger(context: string): WinstonLogger {
    return logger.child({ context });
}

export type Logger = winston.Logger

export default logger;
