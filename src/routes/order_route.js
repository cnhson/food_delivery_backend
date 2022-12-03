const router = require("express").Router();
const order = require("../controller/order_controller");
const middleware = require("../middleware");
const schemas = require("../middleware/schema");

router.get("/history/:status", order.orderHistory);

router.route("/create").post(middleware(schemas.createOrder, PROPERTY_TYPE.body), order.createOrder);
router.route("/profit").get(middleware(schemas.profitPerDay, PROPERTY_TYPE.body), order.profitPerDate);
router.route("/status-change/receive").post(middleware(schemas.receive, PROPERTY_TYPE.body), order.receive);

//test
router.get("/test", order.test);

module.exports = router;
