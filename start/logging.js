const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

const dotenv = require("dotenv");
dotenv.config();

let dbString;
if (process.env.ENV === "production") {
  dbString = process.env.DB;
} else if (process.env.ENV === "developement") {
  dbString = process.env.DB_TEST;
}

// winston logger
const logging = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({
      filename: "log-Exceptions.log",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: "log-Info.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.MongoDB({
      db: dbString,
      level: "error",
      options: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
  ],
});

if (process.env.ENV === "developement") {
  logging.add(
    new winston.transports.Console({
      level: "silly", // output all levels including debug
      handleExceptions: true, // log uncaught exceptions
      format: winston.format.combine(
        winston.format.colorize(), // add color to the console output
        winston.format.cli() // use a simple output format
      ),
    })
  );
}

process.on("unhandledRejection", (error, promise) => {
  logging.error(`Unhandled Promise Rejection: ${error.message}`);
  process.exit(1);
});

// Handle global promise rejections
process.on("uncaughtException", (error) => {
  logging.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

/* const p = Promise.reject(new Error("something failed!!!!!"));
p.then(() => {
  console.log("Done");
}); */

module.exports = logging;
