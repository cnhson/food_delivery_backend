const express = require("express");
const router = express.Router();
const app = require("../controller");

router.get("/init", app.Init);

router.get("*", (req, res) => {
  res.json("Welcome to food delivery app");
});

module.exports = router;
