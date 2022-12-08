const router = require("express").Router();
const order = require("../controller/order_controller");
const middleware = require("../middleware");
const schemas = require("../middleware/schema");
const { PROPERTY_TYPE } = require("../services/constant");

router.get("/history/:status", order.orderHistory);

router.route("/create").post(middleware(schemas.createOrder, PROPERTY_TYPE.body), order.createOrder);
router.route("/profit").get(middleware(schemas.profitPerDay, PROPERTY_TYPE.body), order.profitPerDate);
router.route("/status-change/receive").post(middleware(schemas.receive, PROPERTY_TYPE.body), order.receiveStatusChange);
router.route("/get-store-orders").get(middleware(schemas.getStoreOrders, PROPERTY_TYPE.query), order.getStoreOrders);

//test
router.get("/test", order.test);

module.exports = router;
