const router = require("express").Router();
const comment = require("../controller/comment_controller");
const middleware = require("../middleware");
const schemas = require("../middleware/schema");

router.route("/comment/create").post(middleware, comment.createComment);
router.post("/comment/edit", comment.editComment);
router
  .route("/comment/create")
  .post(middleware(schemas.comment, PROPERTY_TYPE.body), comment.createComment);

module.exports = router;
