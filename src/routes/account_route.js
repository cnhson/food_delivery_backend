const router = require("express").Router();
const account = require("../controller/account_controller");

//router.post("/register", account.registerAccount);

router.post("/login", account.loginAccount);

router.get("/register/customer" , function(req, res, next){ 
    res.locals.cus = true
    next()      
},  account.registerAccount);

router.get("/register/seller"   , function(req, res, next){ 
    res.locals.sel = true
    next()
},  account.registerAccount);



module.exports = router;
