const router = require("express").Router();
const account = require("../controller/account_controller");


router.post("/login", account.loginAccount);
router.post("/test", account.test);

router.post("/register/customer" , function(req, res, next){ 
    req.cus = true,
    next()      
},  account.registerAccount);

router.post("/register/seller"   , function(req, res, next){ 
    req.cus = false,
    next()
},  account.registerAccount);

module.exports = router;
