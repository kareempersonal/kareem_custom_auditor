const winston = require("winston");
const path = require("path");

const time_now = () => {
  return new Date().toISOString();
};

const log = async (inputs) => {
  const logger = winston.createLogger({
    format: winston.format.printf((info) => {
      let message = `${inputs.date} | ${inputs.severity_level} | ${inputs.message}`;
      return message;
    }),
    transports: [
      new winston.transports.File({
        filename: `${inputs.filepath}`,
        level: `${inputs.severity_level}`,
      }),
    ],
  });
  await logger.log({
    level: inputs.severity_level, // Change this line
    message: inputs.message,
    date: inputs.date,
  });
};

module.exports = async (
  message = "",
  severity_level = "info",
  logsPath = false
) => {
  const filepath =
    logsPath || `${path.join(__dirname, "logs", severity_level)}s.log`;
  const date = time_now();
  await log({ filepath, date, message, severity_level });
};
