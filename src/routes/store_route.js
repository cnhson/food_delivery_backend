const router = require("express").Router();
const store = require("../controller/store_controller");

router.post("/create", store.createStore);
router.post("/homepage", function (req, res) {
  res.send("HELLO");
});

module.exports = router;
