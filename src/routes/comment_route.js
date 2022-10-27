const router = require("express").Router();
const comment = require("../controller/comment_controller");

router.post("/create", comment.createComment);

module.exports = router;