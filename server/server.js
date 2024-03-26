const express = require("express");
const cors = require("cors");
const createTables = require("./routes/createTablesRout");
const userRoutes = require("./routes/userRoute");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");
const authMiddleware = require("./middleware/authMiddleware");
const userRankRoutes = require("./routes/userRankRouts");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/", createTables);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/questions", authMiddleware, questionRoutes);
app.use("/api/v1/answers", authMiddleware, answerRoutes);
app.use("/api/v1/ranks", userRankRoutes);

// app.use("/api/v1/", createTables);

const HOST = "127.0.0.1";
const PORT = 5000;
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});

// const cors = require("cors");
// const express = require("express");
// // const session = require("express-session");
// // const passport = require("passport");
// const createTables = require("./routes/createTablesRout");
// // const userRoutes = require("./routes/userRoutes");
// // const questionRoutes = require("./routes/questionRouts");
// // const answerRoutes = require("./routes/answerRouts");
// // const authMiddleware = require("./middleware/authMiddleware");
// // const googleAuth = require("./routes/googleAuth");
// // Require the passport configuration
// // require("./config/passport")(passport);

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Express session
// // app.use(
// //   session({
// //     secret: "keyboard cat",
// //     resave: false,
// //     saveUninitialized: false,
// //   })
// // );

// // Passport middleware
// // app.use(passport.initialize());
// // app.use(passport.session());

// // // Routes
// // app.use("/api/v1/", createTables);
// // app.use("/api/v1/user", userRoutes);
// // app.use("/api/v1/questions", authMiddleware, questionRoutes);
// // app.use("/api/v1/answers", authMiddleware, answerRoutes);
// // app.use("", googleAuth);

// // Error handler undefined routes

// // app.all("*", (req, res, next) => {
// //   res.status(404).json({
// //     status: "fail",
// //     message: `Can't find ${req.originalUrl} on this server!`,
// //   });
// // });

// // Start the server
// const HOST = process.env.HOST;
// const PORT = process.env.PORT;
// app.listen(PORT, HOST, () => {
//   console.log(`Server running at http://${HOST}:${PORT}/`);
// });

// // require('dotenv').config()
// // const express = require("express");
// // var app = express();
// // const port = 7000;

// // const cors = require('cors')
// // app.use(cors())

// // // json middle ware to extract json data
// // app.use(express.json())
// // const dbConnection = require("./db/dbConfig")

// // // user routes midle file
// // const userRoutes = require("./routes/userRoute");

// // // question routes midle file
// // const questionRoutes = require("./routes/questionRoute");

// // // answer routes
// // const answerRoutes = require("./routes/answerRoute");

// // // authentication middleware
// // const authMiddleware = require("./middleware/authMiddleware")

// // // user midlewere route
// // app.use("/api/users" , userRoutes)

// // // question midlewere
// // app.use("/api/question" , authMiddleware, questionRoutes)

// // // answer midlewer
// // app.use("/api/answers" ,authMiddleware, answerRoutes)

// // async function start(){
// //   try{
// //     const result = await dbConnection.execute("select 'test'")
// //     // console.log(result)
// //     await app.listen(port)
// //     console.log("database connection is stablish ")
// //     console.log(`listening to : port ${port}`)

// //   }catch(error){
// //       console.log(error.message);
// //   }
// // }
// // start()

// // // server start
// // // app.listen(port, (err) => {
// // //   if (err) console.log(err.message);
// // //   else console.log(`listening to : port ${port}`);
// // // });
