const router = require("express").Router();
const store = require("../controller/store_controller");
const middleware = require("../middleware");
const schemas = require("../middleware/schema");

router.get("/id=:sid", store.getStore);

router.get("/homepage", store.loadUserStore);

router.route("/new-orders/").get(middleware(schemas.getNewOrders, PROPERTY_TYPE.body), store.getNewOrders);
router
  .route("/status-change/pending")
  .post(middleware(schemas.pendingStatusChange, PROPERTY_TYPE.body), store.pendingStatusChange);

router.route("/create/").post(middleware(schemas.createStore, PROPERTY_TYPE.body), store.createStore);
router.route("/edit/").post(middleware(schemas.editStore, PROPERTY_TYPE.body), store.editStore);
router.route("/get-all-type").get(store.getAllType);

module.exports = router;
