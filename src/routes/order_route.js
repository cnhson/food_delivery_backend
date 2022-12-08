const router = require("express").Router();
const order = require("../controller/order_controller");
const middleware = require("../middleware");
const schemas = require("../middleware/schema");
const { PROPERTY_TYPE } = require("../services/constant");

router.get("/history/:status", order.orderHistory);

router.route("/create").post(middleware(schemas.createOrder, PROPERTY_TYPE.body), order.createOrder);
router.route("/profit").get(middleware(schemas.profitPerDay, PROPERTY_TYPE.body), order.profitPerDate);

/*
    api used to update status of order if store owner call this api
    or customer who own this order want to cancel order before store 
    owner accept order
*/
router.route("/status-change").post(middleware(schemas.updateOrder, PROPERTY_TYPE.body), order.updateStatus);
router.route("/get-store-orders").get(middleware(schemas.getStoreOrders, PROPERTY_TYPE.query), order.getStoreOrders);

//test
router.get("/test", order.test);

module.exports = router;
