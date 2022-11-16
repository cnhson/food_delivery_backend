const { insertOrder, getUserOrderList } = require("../models/order");
const { insertOrderDetail } = require("../models/order_detail");

// account_id: account_id,
// product_id: product_id,
// quantity: quantity,
// payment_method: payment_method,
// status: status,
// timestamp,

module.exports = {
  createOrder: async function (req, res) {
    try {
      const uid = req.session.User.id;
      const product_id = req.body.product_id;

      // Create order's id
      // ex: { user_id: 1, product_id: 9 }
      // oid = u1p9

      const id = "u" + uid + "p" + product_id;
      const account_id = req.body.account_id;
      const quantity = req.body.quantity;
      const payment_method = req.body.payment_method;
      const price = req.body.price;
      const ship_fee = req.body.ship_fee;
      const timestamp = req.body.timestamp;

      const result1 = insertOrder(
        id,
        account_id,
        price,
        ship_fee,
        payment_method,
        timestamp
      );

      const result2 = insertOrderDetail(id, account_id, product_id, quantity);

      const result = await Promise.all([result1, result2]);

      if (result) {
        res.status(200).json({ message: "Create order successfully" });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

  orderHistory: async function (req, res) {
    try {
      const account_id = req.session.User.id;
      let status = "";

      if (req.params.status != null && req.params.status != undefined) {
        status = req.params.status;
      }
      const result = await getUserOrderList(account_id, status);

      if (result.length != 0) {
        res.status(200).json(result);
      } else {
        res.status(200).json({ message: "Error " });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
