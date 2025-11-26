const path = require("path")
const AppError = require(path.join(__dirname, "appError"));
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
    //handle mongoose bad ObjectId error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new AppError(message, 404);
    }
    //handle mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate field value entered: ${JSON.stringify(
      err.keyValue)}`
        err = new AppError(message, 400);
    }
    //handle mongoose validation error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((el) => el.message);
        const message = `Invalid input data. ${errors.join(". ")}`;
        err = new AppError(message, 400);
    }
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}