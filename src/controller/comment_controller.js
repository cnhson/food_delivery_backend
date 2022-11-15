const { insertComment, updateComment } = require("../models/comment");
const { getUserOrderByIds } = require("../models/order");

//id
// store_id:
// order_id:
// account_id:
// comment:
// image:
// star:
// timestamp,
// createdAt
// updatedAt

module.exports = {
  test: async function (req, res) {
    const user_id = 1;
    const order_id = req.params.oid;
    console.log(user_id + order_id + " \n");
    console.log(check[0].status);
    res.status(200).json({ message: "Worked" });
  },

  createComment: async function (req, res, next) {
    try {
      const user_id = req.session.User.id;
      const order_id = req.params.oid;

      const store_id = req.body.store_id;
      const account_id = user_id;
      const comment = req.body.comment;
      const image = req.body.image;
      const star = req.body.star;
      const timestamp = Date.now();
      const createdAt = timestamp;

      const check = await getUserOrderByIds(order_id, user_id);

      if (check.length === 0) {
        res.status(200).json({ error: "Please order first!!" });
        return;
      }
      if (check[0].status != "received") {
        res.status(200).json({ error: "You haven't received the order yet!!" });
        return;
      }

      {
        if (!comment) {
          res.status(200).json({ message: "Please add comment!!" });
          return;
        }
        if (star === null || star === undefined) {
          res.status(200).json({ message: "Please rate the order!!" });
          return;
        }
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
        } else {
          res.status(200).json({ message: "Failed to add comment!!" });
          return;
        }
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

  editComment: async function (req, res, next) {
    try {
      const user_id = req.session.User.id;
      const order_id = req.query.oid;

      const store_id = req.body.store_id;
      const account_id = user_id;
      const comment = req.body.comment;

      const image = req.body.image;
      const star = req.body.star;
      const timestamp = Date.now();
      const updatedAt = timestamp;
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
        res.status(200).json({ message: "Comment edited!!" });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
