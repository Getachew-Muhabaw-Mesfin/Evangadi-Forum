require("dotenv").config();
const connection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { use } = require("bcrypt/promises");
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
      "SELECT username,userId from Users where username=? or email = ?",
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
        .json({ msg: "password must be at least 8 character " });
    }

    // password encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await connection.query(
      "INSERT INTO Users ( username, firstName, lastName, email, password )  VALUES(?,?,?,?,?)",
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

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "fail",
      msg: "Please provide email and password",
    });
  }
  try {
    const [user] = await connection.query(
      "SELECT username,userId,email, password FROM Users WHERE email=? OR password=?",
      [email, password]
    );
    if (user.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        msg: "Invalid email or password",
      });
    }
    // compare the password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        msg: "Invalid email or password",
      });
    }

    const username = user[0].username;
    const userId = user[0].userId;
    const token = jwt.sign({ userId, username }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      token,
      username,
      email,
      userId,
    });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "fail", msg: "Internal server error" });
  }
};

// check functionality
async function checkUser(req, res) {
  const username = req.user.username;
  const userId = req.user.userId;
  return res
    .status(StatusCodes.OK)
    .json({ msg: "valid user", username, userId });
  // res.send("check user");
}

// For Dashboard Implementation

async function getAllUsers(req, res) {
  try {
    const [users] = await connection.query(
      `SELECT userId, username, firstName, lastName, email
    FROM Users`
    );
    return res
      .status(StatusCodes.OK)
      .json({ msg: "all users retrieved successfully", users });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later" });
  }
}

async function updateUser(req, res) {
  const userId = req.params;
  console.log(userId);
  const { username, firstName, lastName, email } = req.body;

  // Check if any required field is missing
  if (!username || !firstName || !lastName || !email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  try {
    // Update user in the database
    const [result] = await connection.execute(
      "UPDATE Users SET username = ?, firstName = ?, lastName = ?, email = ? WHERE userId = ?",
      [username, firstName, lastName, email, userId]
    );

    // Check if the user was found and updated
    if (result.affectedRows === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }

    // User updated successfully
    return res.status(StatusCodes.OK).json({ msg: "User updated" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}

async function deleteUser(req, res) {
  const userId = req.params.userId;
  try {
    await connection.query("DELETE FROM Users WHERE userId = ?", [userId]);
    return res.status(StatusCodes.CREATED).json({ msg: "User deleted" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later" });
  }
}
module.exports = {
  register,
  login,
  checkUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
