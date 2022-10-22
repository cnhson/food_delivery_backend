const router = require("express").Router();
const menu = require("../controller/menu_controller");

router.get("/", menu.listAllProducts);

//router.get("/search",  menu.getProductByName);

module.exports = router;
