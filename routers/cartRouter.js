const router = require("express").Router();
const {
  cartController: {
    addToCart,
    getCartByID,
    editQuantityCart,
    deleteCartById,
    emptyCartByUserID,
  },
} = require("../controllers");

router.get("/:id", getCartByID);
router.post("/:id", addToCart);
router.patch("/:id", editQuantityCart);
router.delete("/:id", deleteCartById);
router.delete("/clear/:id", emptyCartByUserID);

module.exports = router;
