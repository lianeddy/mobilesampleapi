const router = require("express").Router();
const {
  cartController: { addToCart, getCartByID, editQuantityCart, deleteCartById },
} = require("../controllers");

router.get("/:id", getCartByID);
router.post("/:id", addToCart);
router.patch("/:id", editQuantityCart);
router.delete("/:id", deleteCartById);

module.exports = router;
