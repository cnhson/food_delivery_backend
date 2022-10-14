const router = require("express").Router();
const account = require("../controller/account_controller");

router.post("/register", account.registerAccount);
router.post("/login", account.loginAccount);

module.exports = router;
