const errorHandler = (err, req, res, next) => {
  console.error(err);
  const { statusCode, message } = err;
  return res.status(statusCode || 500).json({
    message: "error",
    error: message,
  });
};

module.exports = errorHandler;
