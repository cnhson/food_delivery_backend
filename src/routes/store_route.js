const router = require("express").Router();
const store = require("../controller/store_controller");

router.post("/create", store.createStore);
router.post("/edit", store.editStore);
router.get("/id=:sid", store.getStore);
router.get("/homepage", store.loadUserStore);

module.exports = router;
