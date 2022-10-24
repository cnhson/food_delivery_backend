const express = require("express");
const router = express.Router();
const app = require("../controller");
const account_route = require("./account_route");
const menu = require("../controller/menu_controller");
const store = require("../controller/store_controller");

router.get("/init", app.Init);

router.use("/account", account_route);
router.get("/homepage", menu.listAllProducts);
router.get("/search/:name",  menu.findProduct);
router.post("/store/create", store.createStore);

// router.get("*", (req, res) => {
//   res.json("Welcome to food delivery app");
// });

module.exports = router;
