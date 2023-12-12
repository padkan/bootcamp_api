const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protectd routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  // Get token from header or cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //   else if (req.cookie.token) {
  //     token = req.cookie.token;
  //   }
  // Make sure toke exists
  if (!token) {
    return next(new ErrorResponse("Not authorize to this route", 401));
  }
  try {
    // Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decode: ", decode);
    req.user = await User.findById(decode.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorize to this route", 401));
  }
});
