const winston = require("winston");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const db = async () => {
  let dbString;
  if (process.env.ENV === "production") {
    dbString = process.env.DB;
  } else if (process.env.ENV === "developement") {
    dbString = process.env.DB_TEST;
  }
  await mongoose.connect(dbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  winston.info(`Connected to ${dbString}`);
  console.log(`Connected to ${dbString}`);
};

exports.db = db;
