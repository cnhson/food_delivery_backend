const express = require("express");
const router = express.Router();
const app = require("../controller");
const account_route = require("./account_route");
const menu_route = require("../menu_route");
const store_route = require("../store_route");

router.get("/init", app.Init);

router.use("/account", account_route);
router.use("/menu", menu_route);
router.use("/store", store_route);

// router.get("*", (req, res) => {
//   res.json("Welcome to food delivery app");
// });

module.exports = router;
