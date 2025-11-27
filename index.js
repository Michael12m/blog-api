//3rd party modules
const path = require("path");
const express = require("express");
const connectDB = require(path.join(__dirname,'config','db'));
const morgan=require("morgan");
const cookieParser = require("cookie-parser");
// const mongoSanitize = require("express-mongo-sanitize");
const helmets = require("helmet");
const cors = require("cors");
require("dotenv").config();
//2d party modules
 const postRoutes = require(path.join(__dirname, 'routes', 'postRoutes'));
 const userRoutes = require(path.join(__dirname, 'routes', 'usersRoutes'));
 const commentsRoutes = require(path.join(__dirname, 'routes', 'commentsRoutes'));
 const profileRoutes = require(path.join(__dirname, 'routes', 'profileRoute'));
 const globalErrorHandler = require(path.join(__dirname,'errors', 'globalMiddleWareErr'));
//App initialization
const app = express();
// global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(mongoSanitize());
app.use(helmets());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET));
//routes
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
app.use('/comments', commentsRoutes);
app.use('/profile', profileRoutes);
//global error handler
app.use(globalErrorHandler);
//start server
connectDB();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
