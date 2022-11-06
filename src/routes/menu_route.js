const router = require("express").Router();
const menu = require("../controller/menu_controller");

router.get("/products", menu.listAllProducts);
router.get("/product/find/:name",  menu.findProduct);
router.post("/create/", menu.createProduct);
router.get("/product/id=:pid", menu.productInfo);

module.exports = router;