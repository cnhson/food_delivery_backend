const router = require("express").Router();
const account = require("../controller/account_controller");
const middleware = require("../middleware");
const { schemas } = require("../middleware/schema");
const { PROPERTY_TYPE } = require("../services/constant");

router.post("/login", account.loginAccount);
router.post("/logout", account.logoutAccount);
//router.post("/test", account.test);

router
  .route("/register/customer")
  .post(
    middleware(schemas.registerAccount, PROPERTY_TYPE.body),
    account.registerAccount
  );

router
  .route("/register/seller")
  .post(
    middleware(schemas.registerAccount, PROPERTY_TYPE.body),
    account.registerAccount
  );

router
  .route("/login")
  .post(
    middleware(schemas.loginAccount, PROPERTY_TYPE.body),
    account.loginAccount
  );

module.exports = router;
