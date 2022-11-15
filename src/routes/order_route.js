const router = require("express").Router();
const order = require("../controller/order_controller");

router.post("/create", order.createOrder);
router.get("/history", order.orderHistory);
router.get("/history/status=:status", order.orderHistory);

module.exports = router;
