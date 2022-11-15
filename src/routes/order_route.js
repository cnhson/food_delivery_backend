const router = require("express").Router();
const order = require("../controller/order_controller");

router.post("/create", order.createOrder);

module.exports = router;
