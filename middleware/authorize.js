const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authorize = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied. No token detected!");

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token!");
  }
};

const admin = (req, res, next) => {
  if (!req.user.isAdmin)
    return res.status(403).send("Asccess denied! You are not Admin");
  next();
};

module.exports = {
  authorize,
  admin,
};
