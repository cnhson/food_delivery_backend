const router = require("express").Router();
const store = require("../controller/store_controller");
const middleware = require("../middleware");
const schemas = require("../middleware/schema");

router.get("/id=:sid", store.getStore);

router.post("/create", store.createStore);
router.post("/edit", store.editStore);
router.get("/homepage", store.loadUserStore);
router.get("/orders", store.getNewOrders);
router.post("/status-change/pending", store.pending);

router.route("/create/").post(middleware(schemas.createStore, PROPERTY_TYPE.body), store.createStore);
router.route("/edit/").post(middleware(schemas.editStore, PROPERTY_TYPE.body), store.editStore);

module.exports = router;
