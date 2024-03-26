require("dotenv").config();
const connection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

//  User Registration
async function register(req, res) {
  const { username, firstName, lastName, email, password } = req.body;
  if (!username || !firstName || !lastName || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "fail", msg: "Please provide all required fields" });
  }

  try {
    const [user] = await connection.query(
      "SELECT username,userId from Users where username=? or email = ?",
      [username, email]
    );
    // const passwordPattern =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{8,}$/;
    // if (!passwordPattern.test(password)) {
    //   return res.status(StatusCodes.BAD_REQUEST).json({
    //     status: "fail",
    //     msg: "Password length must 8 and  contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    //   });
    // }
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: "fail", msg: "User already exists" });
    }
    if (password.length <= 8) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        msg: "Password must be greater than 8",
        err: err,
      });
    }

    // password encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await connection.query(
      "INSERT INTO Users ( username, firstName, lastName, email, password )  VALUES(?,?,?,?,?)",
      [username, firstName, lastName, email, hashedPassword]
    );
    return res.status(StatusCodes.CREATED).json({
      status: "success",
      msg: "User Register successfully",
      user: {
        username,
        firstName,
        lastName,
        email,
      },
    });
  } catch (err) {
    console.log(err.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "fail", msg: "Internal server error", err: err });
  }
}

//User login
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
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign({ userId, username }, "secret", {
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
      .json({ status: "fail", msg: "Internal server error", err: error });
  }
};

//Check User Authentication
async function checkUser(req, res) {
  const username = req.user.username;
  const userId = req.user.userId;
  return res
    .status(StatusCodes.OK)
    .json({ msg: "valid user", username, userId });
  // res.send("check user");
}

// Logout
async function logout(req, res) {
  // res.clearCookie("token");
  res.removeHeader("Authorization");
  return res
    .status(StatusCodes.OK)
    .json({ status: "success", msg: "Logged out" });
}

// For Dashboard Implementation

// Get all users
async function getAllUsers(req, res) {
  try {
    const [users] = await connection.query(
      `SELECT userId, username, firstName, lastName, email
    FROM Users`
    );
    return res
      .status(StatusCodes.OK)
      .json({ status: "success", msg: "All users fetched", users });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "fail", msg: "Internal server error" });
  }
}

// Update user
async function updateUser(req, res) {
  const userId = req.params.userId;
  const { username, firstName, lastName, email } = req.body;

  // Check if any required field is missing
  if (!username || !firstName || !lastName || !email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "fail", msg: "Please provide all required fields" });
  }

  try {
    // Update user in the database
    const [result] = await connection.execute(
      "UPDATE Users SET username = ?, firstName = ?, lastName = ?, email = ? WHERE userId = ?",
      [username, firstName, lastName, email, userId]
    );

    // Check if the user was found and updated
    if (result.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "fail", msg: "User not found" });
    }

    // User updated successfully
    return res.status(StatusCodes.OK).json({
      status: "success",
      msg: "User updated",
      user: { username, firstName, lastName, email },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Internal server error",
      error: error.message,
    });
  }
}

// Delete user
async function deleteUser(req, res) {
  const userId = req.params.userId;
  try {
    const [result] = await connection.query(
      "DELETE FROM Users WHERE userId = ?",
      [userId]
    );
    if (result.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "fail", msg: "User not found" });
    }
    return res
      .status(StatusCodes.OK)
      .json({ status: "success", msg: "User deleted", userId });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "fail", msg: "Internal server error" });
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
