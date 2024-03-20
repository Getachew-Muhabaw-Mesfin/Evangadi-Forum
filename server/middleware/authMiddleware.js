const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }
  const token = authHeader.split(" ")[1];
  // console.log(authHeader)
  // console.log(token)

  try {
    const { username, userId } = jwt.verify(token, process.env.JWT_SECRETE);
    req.user = { username, userId };
    next();
    // const {username ,userId} = jwt.verify(authHeader , "secrete");
    // req.user = {username ,userId}
    // next()
    // const data = jwt.verify(authHeader , "secrete");
    //  return res.status(StatusCodes.OK).json({data})
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authontication invalid ...." });
  }
}
module.exports = authMiddleware;
