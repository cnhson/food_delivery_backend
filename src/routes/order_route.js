const router = require("express").Router();
const order = require("../controller/order_controller");
const middleware = require("../middleware");
const schemas = require("../middleware/schema");

router.get("/history/:status", order.orderHistory);

router.route("/create").post(middleware(schemas.createOrder, PROPERTY_TYPE.body), order.createOrder);
router.route("/calculate").get(middleware(schemas.calculate, PROPERTY_TYPE.body), order.calculate);
router.route("/status-change/receive").post(middleware(schemas.receive, PROPERTY_TYPE.body), order.receive);

//test random id
router.get("/test", order.test);

module.exports = router;
