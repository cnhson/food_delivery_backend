const router = require("express").Router();
const menu = require("../controller/menu_controller");
const comment = require("../controller/comment_controller");

router.get("/products", menu.listAllProducts);
router.get("/product/find/:name", menu.findProduct);
router.post("/create/", menu.createProduct);
router.post("/edit/", menu.editProduct);
router.get("/product/id=:pid", menu.productInfo);

module.exports = router;
