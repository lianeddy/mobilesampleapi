const router = require("express").Router();
const {
  transactionContoller: { getTransactionsByUserID, postTransaction },
} = require("../controllers");

router.get("/:id", getTransactionsByUserID);
router.post("/:id", postTransaction);

module.exports = router;
