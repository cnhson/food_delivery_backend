const { insertComment } = require("../models/comment");

module.exports = {

createComment: async function (req, res, next) {
    try {
        // store_id: store_id,
        // order_id: order_id,
        // account_id: account_id,
        // comment: comment,
        // image: image,
        // star: star,
        // timestamp,
      const store_id = req.body.store_id;
      const order_id = req.body.order_id;
      const account_id = req.body.account_id;
      const comment = req.body.comment;
      const image = req.body.image;
      const star = req.body.star;
      const timestamp = req.body.timestamp;
        // Insert comment into database
        const result = await insertComment(
            store_id,
            order_id,
            account_id,
            comment,
            image,
            star,
            timestamp
          );

          if (result) {
            res.status(200).json({ message: "Create comment successfully" });
          } 
    } catch (err) {
      res.status(500).send(err);
    }
  },
}