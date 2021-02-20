const {
  userController: { selectAllUsers, login, register, keepLogin },
} = require("../controllers");
const {
  jwt: { genValidate },
} = require("../handlers");

const router = require("express").Router();

router.get("/", selectAllUsers);
router.post("/login", login);
router.post("/register", register);
router.post("/keep-login", genValidate, keepLogin);

module.exports = router;
