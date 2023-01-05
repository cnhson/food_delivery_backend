const router = require("express").Router();
const order = require("../controller/order_controller");
const middleware = require("../middleware");
const schemas = require("../middleware/schema");
const { PROPERTY_TYPE } = require("../services/constant");

router.route("/get-history/").get(middleware(schemas.getAccountOrders, PROPERTY_TYPE.query), order.getHistory);
router.post("/get-comment", order.OrderComment);
router.post("/state", order.getOrderReceivedState);

router.route("/create").post(middleware(schemas.createOrder, PROPERTY_TYPE.body), order.createOrder);
router.route("/profit").get(middleware(schemas.profitPerDay, PROPERTY_TYPE.body), order.profitPerDate);
router
  .route("/proceed")
  .post(middleware(schemas.proceedOrderWithStore, PROPERTY_TYPE.body), order.proceedOrderWithStore);

/*
    api used to update status of order if store owner call this api
    or customer who own this order want to cancel order before store 
    owner accept order
*/
router.route("/status-change").post(middleware(schemas.updateOrder, PROPERTY_TYPE.body), order.updateStatus);
router.route("/get-store-orders").get(middleware(schemas.getStoreOrders, PROPERTY_TYPE.query), order.getStoreOrders);
router.route("/get-order/:order_id").get(middleware(schemas.OrderId, PROPERTY_TYPE.params), order.getOrderDetail);

//test
router.get("/test", order.test);

module.exports = router;
