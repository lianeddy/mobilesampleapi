const multer = require("multer");
const con = require("../database");
const pify = require("pify");
const { uploader } = require("../handlers");

const path = "/products";
const upload = pify(uploader(path, "PRD").fields([{ name: "image" }]));

const getProducts =
  "select p.id, p.name, p.price, p.description, p.isAvailable, c.category from products p join categories c on c.id = p.categoryID";

module.exports = {
  insertProduct: async (req, res, next) => {
    try {
      const [
        insertProduct,
      ] = await con.promise().query(`insert into products set ?`, [req.body]);
      return res
        .status(200)
        .send({ id: insertProduct.insertId, status: "success" });
    } catch (err) {
      next(err);
    }
  },
  insertProductPhoto: async (req, res, next) => {
    try {
      await upload(req, res);
      const [
        insertPhoto,
      ] = await con
        .promise()
        .query(`insert into productimage (imagepath, productID) values (?,?)`, [
          `${path}/${req.files.image[0].filename}`,
          req.body.productID,
        ]);
      return res.status(200).send("success");
    } catch (err) {
      next(err);
    }
  },
  getProducts: async (req, res, next) => {
    const { category, minPrice, maxPrice, name } = req.query;
    try {
      let whereClause = " where isAvailable = 1";
      name ? (whereClause += ` and p.name like '%${name}%'`) : null;
      category ? (whereClause += ` and c.category = '${category}'`) : null;
      minPrice ? (whereClause += ` and p.price > ${minPrice}`) : null;
      maxPrice ? (whereClause += ` and p.price < ${maxPrice}`) : null;
      const [products] = await con.promise().query(getProducts + whereClause);
      const [productImage] = await con
        .promise()
        .query("select * from productimage");
      const response = products.map((val) => {
        return {
          ...val,
          image: productImage.filter((item) => {
            return item.productID === val.id;
          }),
        };
      });
      return res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  },
  getProductByID: async (req, res, next) => {
    try {
      const [product] = await con
        .promise()
        .query(getProducts + " where p.id = ?", [req.params.id]);
      const [
        productImage,
      ] = await con
        .promise()
        .query("select * from productimage where productID = ?", [
          req.params.id,
        ]);
      const response = {
        ...product[0],
        image: productImage,
      };
      return res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  },
};
