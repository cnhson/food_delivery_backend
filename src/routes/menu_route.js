const router = require("express").Router();
const menu = require("../controller/menu_controller");
const middleware = require("../middleware");
const schemas = require("../middleware/schema");
const { PROPERTY_TYPE } = require("../services/constant");

router.route("/get-all-products/:storeId").get(middleware(schemas.storeId, PROPERTY_TYPE.params), menu.getAllProducts);
router.route("/get-product/:product_id").get(middleware(schemas.product_id, PROPERTY_TYPE.params), menu.getProduct);
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
