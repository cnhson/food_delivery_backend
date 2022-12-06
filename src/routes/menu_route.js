const router = require("express").Router();
const menu = require("../controller/menu_controller");
const middleware = require("../middleware");
const schemas = require("../middleware/schema");

router.route("/products").get(menu.listAllProducts);
router.route("/get-product/:name").get(menu.findProduct);
router.route("/product/:id").get(menu.productInfo);
router
  .route("/get-all-product-type/:storeId")
  .get(middleware(schemas.storeId, PROPERTY_TYPE.params), menu.getAllProductType);
router.route("/new-product/").post(middleware(schemas.createProduct, PROPERTY_TYPE.body), menu.createProduct);
router.route("/edit-product/").post(middleware(schemas.editProduct, PROPERTY_TYPE.body), menu.editProduct);

router
  .route("/new-product-type/")
  .post(middleware(schemas.createProductType, PROPERTY_TYPE.body), menu.createProductType);

module.exports = router;
