const router = require("express").Router();
const store = require("../controller/store_controller");

router.post("/create", store.createStore);
router.get("/id=:sid", store.getStore);
router.post("/homepage", function (req, res) {
  res.send("HELLO");
});

module.exports = router;
