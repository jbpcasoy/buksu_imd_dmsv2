import pino from "pino";
import pretty from "pino-pretty";
const logger = pino(
  {
    level: "info",
  },
  pretty({
    singleLine: true,
    errorLikeObjectKeys: ["err", "error"],
  })
);

export default logger;
