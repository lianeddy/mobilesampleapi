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

      const [
        address,
      ] = await con
        .promise()
        .query(`select id, address from address where userID = ?`, [id]);
      const response = {
        ...user[0],
        address,
        token: req.token,
      };
      return res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  },
  getAddressbyID: async (req, res, next) => {
    try {
      const [
        address,
      ] = await con
        .promise()
        .query(`select id, address from address where userID = ?`, [
          req.params.id,
        ]);
      return res.status(200).send(address);
    } catch (err) {
      next(err);
    }
  },
  addAddressUser: async (req, res, next) => {
    try {
      const body = { ...req.body, userID: req.params.id };
      const response = await con
        .promise()
        .query(`insert into address set ?`, [body]);
      return res.status(500).send({ id: response.insertId, status: "created" });
    } catch (err) {
      next(err);
    }
  },
  editAddressUser: async (req, res, next) => {
    try {
      await con
        .promise()
        .query(`update address set ? where id = ?`, [req.params.id]);
      return res.status(200).send({ id: req.params.id, status: "edited" });
    } catch (err) {
      next(err);
    }
  },
};
