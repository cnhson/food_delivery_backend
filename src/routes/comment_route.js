const router = require("express").Router();
const comment = require("../controller/comment_controller");

router.post("/:oid/feedback", comment.createComment);

module.exports = router;