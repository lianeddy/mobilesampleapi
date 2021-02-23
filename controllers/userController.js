const con = require("../database");
const encryptHandler = require("../handlers/encryptHandler");
const {
  jwt: { createToken },
} = require("../handlers/");

module.exports = {
  selectAllUsers: async (req, res, next) => {
    try {
      const [rows, fields] = await con.promise().query(`select * from users`);
      return res.status(200).send(rows);
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    const { username, password } = req.body;
    const hash = encryptHandler(password);
    try {
      const [
        users,
      ] = await con
        .promise()
        .query(
          `select id, username, email, roleID from users where username = ? and password = ?`,
          [username, hash]
        );
      let response;
      let statusCode;
      users.length !== 0
        ? (response = { ...users[0], token: createToken(users[0]) })
        : (response = { error: "user not found" });
      response.error ? (statusCode = 404) : (statusCode = 200);
      return res.status(statusCode).send(response);
    } catch (err) {
      next(err);
    }
  },
  register: async (req, res, next) => {
    try {
      req.body.password = encryptHandler(req.body.password);
      const [insertUser] = await con
        .promise()
        .query(`insert into users set ?`, req.body);
      const [
        getUser,
      ] = await con
        .promise()
        .query(`select id, username, email, roleID from users where id = ?`, [
          insertUser.insertId,
        ]);
      const response = {
        ...getUser[0],
        token: createToken(getUser[0]),
      };
      return res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  },
  keepLogin: async (req, res, next) => {
    const { id } = req.user;
    try {
      const [
        user,
      ] = await con
        .promise()
        .query(`select id, username, email, roleID from users where id = ?`, [
          id,
        ]);
      const response = {
        ...user[0],
        token: req.token,
      };
      return res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  },
};
