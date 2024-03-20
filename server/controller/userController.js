const connection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, firstName, lastName, email, password } = req.body;
  if (!username || !firstName || !lastName || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all the information " });
  }

  try {
    const [user] = await connection.query(
      "SELECT username,userId from users where username=? or email = ?",
      [username, email]
    );
    // return res.json({user :user})
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "user already exist" });
    }
    if (password.length <= 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "password must be atleast 8 character " });
    }

    // password encription
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await connection.query(
      "INSERT INTO users ( username, firstName, lastName, email, password )  VALUES(?,?,?,?,?)",
      [username, firstName, lastName, email, hashedPassword]
    );
    return res.status(StatusCodes.CREATED).json({ msg: "user created" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong please try again" });
  }
}

// function login(req, res) {
//   res.send("user login");
// }
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all the required field  " });
  }

  try {
    const [user] = await connection.query(
      "SELECT username,userId, password from users where email = ?",
      [email]
    );
    // return res.json({user :user})
    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credential" });
    }
    // // compare the password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credential" });
    }

    // ready to return token
    // return res.json({user :user[0].password})
    // if the user email and password is correct return token

    const username = user[0].username;
    const userId = user[0].userId;
    const token = jwt.sign({ username, userId }, process.env.JWT_SECRETE, {
      expiresIn: "1d",
    });

    return res
      .status(StatusCodes.OK)
      .json({ msg: "user login successfully", token, username });
  } catch (err) {
    console.log(err.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong please try again" });
  }
}

// check functionality
async function checkUser(req, res) {
  const username = req.user.username;
  const userId = req.user.userId;
  return res
    .status(StatusCodes.OK)
    .json({ msg: "valid user", username, userId });
  // res.send("check user");
}

module.exports = { register, login, checkUser };
