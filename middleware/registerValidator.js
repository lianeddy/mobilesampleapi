const { body, validationResult, check } = require("express-validator");
const con = require("../database");

const registerValidator = [
  body("username").custom((value) => {
    return con
      .promise()
      .query(`select id from users where username = ?`, [value])
      .then(([user]) => {
        if (user.length) {
          return Promise.reject("Username already taken");
        }
      });
  }),
  body("email").custom((value) => {
    return con
      .promise()
      .query(`select id from users where email = ?`, [value])
      .then(([user]) => {
        if (user.length) {
          return Promise.reject("Email already taken");
        }
      });
  }),
  body("password")
    .isLength({ min: 8 })
    // .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
    .withMessage("Password must contain 8 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errors.array());
    }
    return next();
  },
];

module.exports = registerValidator;
