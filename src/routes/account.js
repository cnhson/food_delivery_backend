const router = require("express").Router();
const account = require("../controller/account_controller");

router.get("/get-all-account", account.getAllAccount);

module.exports = router;
