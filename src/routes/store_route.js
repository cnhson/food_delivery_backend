const router = require("express").Router();
const store = require("../controller/store_controller");

router.post("/create", store.createStore);

module.exports = router;