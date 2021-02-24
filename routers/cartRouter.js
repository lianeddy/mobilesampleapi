const router = require("express").Router();
const {
  cartController: { addToCart, getCartByID, editQuantityCart },
} = require("../controllers");

router.get("/:id", getCartByID);
router.post("/:id", addToCart);
router.patch("/:id", editQuantityCart);

module.exports = router;
