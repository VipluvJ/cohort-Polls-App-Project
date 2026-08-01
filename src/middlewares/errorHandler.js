import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  // Errors we intentionally created
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unexpected errors
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorHandler;
