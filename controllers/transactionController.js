const con = require("../database");
const moment = require("moment");

module.exports = {
  getTransactionsByUserID: async (req, res, next) => {
    try {
      const [
        transactionData,
      ] = await con
        .promise()
        .query(`select * from transaction where userID = ?`, [req.params.id]);
      const [transactionItems] = await con
        .promise()
        .query(`select * from transaction_item`);
      const response = transactionData.map((val) => {
        return {
          ...val,
          items: transactionItems.filter((item) => {
            return item.transactionID === val.id;
          }),
        };
      });
      return res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  },
  postTransaction: async (req, res, next) => {
    try {
      const { items } = req.body;
      const date = new Date();
      let total_amount = 0;
      items.forEach((element) => {
        total_amount += element.price * element.quantity;
      });
      const transactionBody = { userID: req.params.id, date, total_amount };
      const [
        transaction,
      ] = await con
        .promise()
        .query(`insert into transaction set ?`, [transactionBody]);
      const values = [];
      items.forEach(({ productID, quantity, price }) => {
        values.push([productID, quantity, transaction.insertId, price]);
      });
      const [
        transactionItems,
      ] = await con
        .promise()
        .query(
          `insert into transaction_item (productID, quantity, transactionID, price) values ?`,
          [values]
        );
      return res
        .status(200)
        .send({ id: transaction.insertId, status: "created" });
    } catch (err) {
      next(err);
    }
  },
};
