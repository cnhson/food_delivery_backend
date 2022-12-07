const { insertComment, updateComment, getCommetByIdAndAccount } = require("../models/comment");
const { getOrderByAccount } = require("../models/order");

module.exports = {
  createComment: async function (req, res) {
    try {
      const account_id = Number(req.session.User.id);
      const store_id = req.body.store_id;
      const order_id = req.body.order_id;
      const comment = req.body.comment;
      const image = req.body.image || "";
      const star = req.body.star;
      // check if account has order before comment
      const check = await getOrderByAccount(account_id, order_id);

      if (check === null || check === undefined) {
        res.status(200).json({ message: "Please order first!!" });
        return;
      } else if (check[0].status != "received") {
        res.status(200).json({ message: "You haven't received the order yet!!" });
        return;
      } else {
        // Insert comment into database
        const createAt = new Date().getTime();
        const result = await insertComment(store_id, order_id, account_id, comment, image, star, createAt, createAt);
        if (result) {
          res.status(200).json({ message: "Comment added, thanks you again!!" });
        }
      }
    } catch (err) {
      res.status(500).send("Error vai lon");
    }
  },

  editComment: async function (req, res) {
    try {
      const account_id = Number(req.session.User.id);
      const comment_id = Number(req.body.comment_id);
      const comment = req.body.comment;
      const image = req.body.image || "";
      const star = req.body.star;

      //check if comment id belong to account
      const check = await getCommetByIdAndAccount(account_id, comment_id);
      if (check === null || check === undefined) {
        res.status(500).json({ error: "You are not the owner of this comment" });
        return;
      }

      // Update comment into database
      const updateAt = new Date().getTime();
      const result = await updateComment(comment_id, comment, image, star, updateAt);

      if (result) {
        res.status(200).json({ message: "Comment editted!!" });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
