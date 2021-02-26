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
          "select c.id, p.name, c.quantity, p.price, p.id as productID, p.isAvailable from cart c join products p on p.id = c.productID where c.userID = ?;",
          [req.params.id]
        );
      const [productImage] = await con
        .promise()
        .query(`select * from productimage`);
      const response = cart.map((val) => {
        return {
          ...val,
          image: productImage.filter((item) => {
            return item.productID === val.productID;
          }),
        };
      });
      return res.status(200).send(response);
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
  deleteCartById: async (req, res, next) => {
    try {
      await con
        .promise()
        .query(`delete from cart where id = ?`, [req.params.id]);
      return res.status(200).send({ id: req.params.id, status: "deleted" });
    } catch (err) {
      next(err);
    }
  },
  emptyCartByUserID: async (req, res, next) => {
    try {
      const [
        carts,
      ] = await con
        .promise()
        .query(`select id from cart where userID = ?`, [req.params.id]);
      const ids = carts.map((val) => val.id);
      await con.promise().query(`delete from cart where id in ?`, [[ids]]);
      return res.status(200).send({ id: req.params.id, status: "deleted" });
    } catch (err) {
      next(err);
    }
  },
};
