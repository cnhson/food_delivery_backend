const {
  insertOrder,
  getUserOrderList,
  calculateTotal,
} = require("../models/order");
const { insertOrderDetail } = require("../models/order_detail");
const crypto = require("crypto");

// account_id: account_id,
// product_id: product_id,
// quantity: quantity,
// payment_method: payment_method,
// status: status,
// timestamp,

module.exports = {
  calculate: async function (req, res) {
    try {
      const store_id = req.body.store_id;
      const str_date1 = req.body.date1;
      const str_date2 = req.body.date2;
      let mil1 = 0;
      let mil2 = 0;
      if (str_date2.length === 0) {
        mil1 = Date.parse(str_date1 + " 00:00:00");
        mil2 = Date.parse(str_date1 + " 23:59:59");
        console.log(mil1 + "\n" + mil2);
      } else {
        mil1 = Date.parse(str_date1 + " 00:00:00");
        mil2 = Date.parse(str_date2 + " 23:59:59");
        console.log(mil1 + "\n" + mil2);
      }
      const totalprice = await calculateTotal(store_id, mil1, mil2);
      res.status(200).json(totalprice);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  test: async function (req, res) {
    const rid1 = crypto.randomBytes(3).toString("hex");
    const rid2 = crypto.randomBytes(3).toString("hex");
    res.status(200).json({ r1: rid1, r2: rid2 });
  },

  createOrder: async function (req, res) {
    try {
      const account_id = req.session.User.id;
      const store_id = req.body.store_id;
      const product_id = req.body.product_id;
      // create random order id - length(6)
      const oid = crypto.randomBytes(3).toString("hex");
      const final_id = "S" + store_id + "O" + oid;
      // Create order's id
      const id = final_id;
      const quantity = req.body.quantity;
      const payment_method = req.body.payment_method;
      const ship_fee = req.body.ship_fee;
      const price = req.body.price;
      const timestamp = req.body.timestamp;

      const result1 = insertOrder(
        id,
        account_id,
        price,
        ship_fee,
        payment_method,
        timestamp
      );

      const result2 = insertOrderDetail(id, product_id, quantity);

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

      if (req.params.status != "any") {
        status = req.params.status;
      }
      console.log("test [" + status + "]");
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
