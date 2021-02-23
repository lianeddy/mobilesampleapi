const errorHandler = (err, req, res, next) => {
  console.error(err);
  const { statusCode, message } = err;
  return res.status(statusCode || 500).json({
    message: "Error",
    error: message || err[0].msg,
  });
};

module.exports = errorHandler;
