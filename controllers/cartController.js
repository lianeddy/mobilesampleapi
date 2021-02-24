const { response } = require("express");
const con = require("../database");

module.exports = {
  addToCart: async (req, res, next) => {
    try {
      const body = { ...req.body, userID: req.params.id };
      const [cart] = await con
        .promise()
        .query("insert into cart set ?", [body]);
      return res.status(200).send({ id: cart.insertId, status: "success" });
    } catch (err) {
      next(err);
    }
  },
  getCartByID: async (req, res, next) => {
    try {
      const [
        cart,
      ] = await con
        .promise()
        .query(
          "select c.id, p.name, c.quantity, p.price, p.isAvailable from cart c join products p on p.id = c.productID where c.userID = ?;",
          [req.params.id]
        );
      return res.status(200).send(cart);
    } catch (err) {
      next(err);
    }
  },
  editQuantityCart: async (req, res, next) => {
    try {
      const [
        quantity,
      ] = await con
        .promise()
        .query("update cart set quantity = ? where id = ?", [
          req.body.quantity,
          req.params.id,
        ]);
      return res.status(200).send({ id: req.params.id, status: "success" });
    } catch (err) {
      next(err);
    }
  },
};
