const express = require("express");
const app = express();

// validation
const { validation } = require("./start/validation");
validation();

// routes
const { routes } = require("./start/routes");
routes(app);

// database
const { db } = require("./start/db");
db();

// log and errors
require("express-async-errors");
const logging = require("./start/logging");

// loading express
const dotenv = require("dotenv");
dotenv.config();

// production only required
const { prod } = require("./start/prod");
prod(app);

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  logging.info(`Listening on port ${port}...`)
);

module.exports = server;
