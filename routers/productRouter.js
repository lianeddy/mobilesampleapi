const {
  productController: {
    insertProduct,
    insertProductPhoto,
    getProducts,
    getProductByID,
  },
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
router.get("/:id", getProductByID);

module.exports = router;
