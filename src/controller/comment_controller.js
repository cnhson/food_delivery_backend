const { insertComment, updateComment } = require("../models/comment");
const { checkExistUserOrder } = require("../models/order");

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
      const check = await checkExistUserOrder(order_id, user_id);
      if (check === null && check === undefined) {
        res.status(200).json({ message: "Please order first!!" });
        return;
      } else if (check[0].status != "received") {
        res
          .status(200)
          .json({ message: "You haven't received the order yet!!" });
        return;
      } else {
        const store_id = req.body.store_id;
        const account_id = req.body.account_id;
        const comment = req.body.comment;
        const image = req.body.image;
        const star = req.body.star;
        const timestamp = req.body.timestamp;
        const createdAt = timestamp;
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
      res.status(500).send(err);
    }
  },

  editComment: async function (req, res, next) {
    try {
      const user_id = req.session.User.id;
      const order_id = req.params.oid;

      const store_id = req.body.store_id;
      const account_id = req.body.account_id;
      const comment = req.body.comment;
      const image = req.body.image;
      const star = req.body.star;
      const timestamp = req.body.timestamp;
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
        res.status(200).json({ message: "Comment editted!!" });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
