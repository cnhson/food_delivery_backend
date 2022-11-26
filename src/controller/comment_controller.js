const { insertComment, updateComment } = require("../models/comment");
const { getExistUserOrder } = require("../models/order");

module.exports = {
  createComment: async function (req, res) {
    try {
      const account_id = req.session.User.id;
      const store_id = req.body.store_id;
      const product_id = req.body.product_id;

      const check = await getExistUserOrder(account_id, product_id);

      if (check === null || check === undefined) {
        res.status(200).json({ message: "Please order first!!" });
        return;
      } else if (check[0].status != "done") {
        res
          .status(200)
          .json({ message: "You haven't received the order yet!!" });
        return;
      } else {
        const order_id = check[0].order_id;
        const comment = req.body.comment;
        const image = req.body.image;
        const star = req.body.star;
        const timestamp = req.body.timestamp;
        const createdAt = req.body.createdAt;

        // Insert comment into database
        const result = await insertComment(
          store_id,
          order_id,
          account_id,
          comment,
          image,
          star,
          timestamp,
          createdAt
        );

        if (result) {
          res
            .status(200)
            .json({ message: "Comment added, thanks you again!!" });
        }
      }
    } catch (err) {
      res.status(500).send("Error vai lon");
    }
  },

  editComment: async function (req, res) {
    try {
      const account_id = req.session.User.id;
      const order_id = req.body.order_id;
      const store_id = req.body.store_id;
      const comment = req.body.comment;
      const image = req.body.image;
      const star = req.body.star;
      const timestamp = req.body.timestamp;
      const updatedAt = req.body.updatedAt;
      // Insert comment into database
      const result = await updateComment(
        store_id,
        order_id,
        account_id,
        comment,
        image,
        star,
        timestamp,
        updatedAt
      );

      if (result) {
        res.status(200).json({ message: "Comment editted!!" });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
