const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const createTables = require("./routes/createTablesRout");
const userRoutes = require("./routes/userRoute");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");
const authMiddleware = require("./middleware/authMiddleware");
const userRankRoutes = require("./routes/userRankRouts");
const countAllEntities = require("./routes/entitiesCounterRoute");
const googleAuth = require("./routes/googleAuthRout");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// passport Config
require("./Auth/passport")(passport);

// Express session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/v1/", createTables);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/questions", authMiddleware, questionRoutes);
app.use("/api/v1/answers", authMiddleware, answerRoutes);
app.use("/api/v1/ranks", authMiddleware, userRankRoutes);

// Count All  Entities
app.use("/api/v1/entities", countAllEntities);

// Google Auth
app.use("/auth", googleAuth);

// for undefined route
app.use("*", (req, res) => {
  res.status(404).json({ msg: "ERROR" });
});

const HOST = "127.0.0.1";
const PORT = 5000;
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
