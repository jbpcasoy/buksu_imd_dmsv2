import pino from "pino";
import pretty from "pino-pretty";
const logger = pino(
  {
    level: process.env.NODE_ENV === "development" ? "error" : "info",
  },
  pretty({
    singleLine: true,
    errorLikeObjectKeys: ["err", "error"],
  })
);

export default logger;
