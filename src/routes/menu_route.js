const router = require("express").Router();
const menu = require("../controller/menu_controller");
const middleware = require("../middleware");
const schemas = require("../middleware/schema");

router.get("/products", menu.listAllProducts);
router.get("/product/find/:name", menu.findProduct);
router.get("/product/id=:pid", menu.productInfo);

router.route("/create/").post(middleware(schemas.createProduct, PROPERTY_TYPE.body), menu.createProduct);
router.route("/edit/").post(middleware(schemas.editProduct, PROPERTY_TYPE.body), menu.editProduct);

module.exports = router;
