const winston = require("winston");
const logging = require("../start/logging");

const error = (err, req, res, next) => {
  // also log the error
  logging.log("error", err.message, err);

  //error
  //warn
  //info
  //verbose
  //debug
  //silly

  res.status(500).send("Internal Server Error!");
};

module.exports = {
  error,
};
