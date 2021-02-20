const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  return jwt.sign({ ...payload }, process.env.SECRET || "secretkey");
};

const genValidate = (req, res, next) => {
  if (!req.token) {
    return res.status(401).send("not authorized");
  }
  try {
    const decoded = jwt.verify(req.token, process.env.SECRET || "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

const adminValidate = (req, res, next) => {
  if (!req.token) {
    return res.status(401).send("not authorized");
  }
  try {
    const { roleID } = jwt.verify(req.token, process.env.SECRET || "secretkey");
    if (roleID !== 1) {
      return res.status(401).send("not authorized");
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createToken,
  genValidate,
  adminValidate,
};
