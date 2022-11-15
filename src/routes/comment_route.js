const router = require("express").Router();
const comment = require("../controller/comment_controller");
const middleware = require("../middleware");

router.route("/feedback/:oid").post(middleware, comment.createComment);
router.post("/feedback/edit", comment.editComment);

module.exports = router;
