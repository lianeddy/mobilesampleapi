const {
  productController: { insertProduct, insertProductPhoto, getProducts },
} = require("../controllers");
const {
  uploader,
  jwt: { adminValidate },
} = require("../handlers");

const router = require("express").Router();

router.post(
  "/",
  // adminValidate,
  insertProduct
);
router.post(
  "/image",
  // adminValidate,
  insertProductPhoto
);
router.get("/", getProducts);

module.exports = router;
