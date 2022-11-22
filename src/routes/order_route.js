const router = require("express").Router();
const order = require("../controller/order_controller");

router.post("/create", order.createOrder);
router.get("/history/:status", order.orderHistory);
router.get("/calculate/", order.calculate);

//test random id
router.get("/test", order.test);

module.exports = router;
