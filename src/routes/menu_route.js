const router = require("express").Router();
const menu = require("../controller/menu_controller");

router.get("/get-all-products", menu.listAllProducts);
router.get("/get-product-by-name/:name",  menu.findProduct);

module.exports = router;