const jwt = require("jsonwebtoken");
const { ErrorHandler } = require("../utils/error");

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    throw new ErrorHandler(400, "Token missing");
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET);
    req.user = verified;
    next();
  } catch (error) {
    throw new ErrorHandler(400, error.message || "Invalid Token");
  }
};

module.exports = verifyToken;
