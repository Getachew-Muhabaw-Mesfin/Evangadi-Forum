const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: "fail",
      msg: "No token, authorization denied",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const JWT_SECRET = "secret";
    const { username, userId } = jwt.verify(token, JWT_SECRET);
    req.user = { username, userId };
    next();
    // return res.status(StatusCodes.OK).json({
    //   status: "success",
    //   username,
    //   userId,
    // });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(StatusCodes.UNAUTHORIZED).json({
      status: "fail",
      msg: "Token is not valid",
    });
  }

  //   const token = req.header("x-auth-token");
  //   if (!token) {
  //     return res.status(StatusCodes.UNAUTHORIZED).json({
  //       status: "fail",
  //       msg: "No token, authorization denied",
  //     });
  //   }
  //   try {
  //     const JWT_SECRET = "secret";
  //     const {username,userId} = jwt.verify(token, JWT_SECRET);
  //     req.user = { username, userId };
  //     next();
  //   } catch (error) {
  //     console.error("Error verifying token:", error.message);
  //     res.status(StatusCodes.UNAUTHORIZED).json({
  //       status: "fail",
  //       msg: "Token is not valid",
  //     });
  //   }
};

module.exports = authMiddleware;
