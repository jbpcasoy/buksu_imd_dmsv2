import pino from "pino";
import pretty from "pino-pretty";
const logger = pino(
  // {
  //   level: process.env.NODE_ENV === "development" ? "silent" : "info",
  // },
  pretty({
    singleLine: true,
    errorLikeObjectKeys: ["err", "error"],
    messageKey: "message",
  })
);

export default logger;
