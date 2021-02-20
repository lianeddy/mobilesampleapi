const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "lianeddy",
  database: "commercedb",
  port: 3306,
  password: "asd123",
});

module.exports = con;
