const express = require("express");
const router = express.Router();
const app = require("../controller");
const account_route = require("./account_route");
const menu = require("../controller/menu_controller");

router.get("/init", app.Init);

router.use("/account", account_route);
router.get("/homepage", menu.listAllProducts);
router.get("/search/:name",  menu.findProduct);

// router.get("*", (req, res) => {
//   res.json("Welcome to food delivery app");
// });

module.exports = router;
