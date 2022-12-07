const { insertOrder, getUserOrderList, calculateTotalPerDayWithLimit, receiveOrder } = require("../models/order");
const { insertOrderDetail } = require("../models/order_detail");
const crypto = require("crypto");

module.exports = {
  receive: async function (req, res) {
    try {
      const order_id = req.body.order_id;
      const account_id = req.session.User.id;

      const receive_res = await receiveOrder(order_id, account_id);
      if (receive_res) res.status(200).json({ message: "Order received!!" });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  //Chart

  profitPerDate: async function (req, res) {
    try {
      const store_id = req.body.store_id;

      //How many prev days limited by number
      const limit = req.body.limit;

      const data = await calculateTotalPerDayWithLimit(store_id, limit);

      //Change to array[[timestamp,total]]
      let arraydata = [];

      for (const index in data) {
        arraydata.push([parseInt(data[index].otimestamp), data[index].total]);
      }
      res.status(200).json(arraydata);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  createOrder: async function (req, res) {
    try {
      const order_id = req.body.order_id;
      const account_id = req.body.id;
      const store_id = req.body.store_id;
      const order_detail = res.body.store_id;
      const payment_method = req.body.payment_method;
      const ship_fee = req.body.ship_fee;
      const price = req.body.price;
      const timestamp = req.body.timestamp;

      // insert order into db
      const result1 = await insertOrder(order_id, store_id, account_id, price, ship_fee, payment_method, timestamp);
      if (!result1) {
        res.status(500).json({ error: "Create order failed!" });
        return;
      }

      // insert order detail to db
      for (let i = 0; i < order_detail.length; i++) {
        const { product_id, quantity } = order_detail[i];
        const result2 = await insertOrderDetail(order_id, product_id, quantity);
        if (!result2) {
          res.status(500).json({ error: "Create order detail failed!" });
          return;
        }
      }

      res.status(200).json({ message: "Create order successfully" });
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

  test: async function (req, res) {
    const rid1 = crypto.randomBytes(3).toString("hex");
    const rid2 = crypto.randomBytes(5).toString("hex");
    res.status(200).json({ r1: rid1, r2: rid2 });
  },

  //Table

  // profitPerDate: async function (req, res) {
  //   try {
  //     const store_id = req.body.store_id;

  //     const page = req.body.page_id;
  //     const PAGE_SIZE = 5;
  //     const skip = (page - 1) * PAGE_SIZE;

  //     const records = await calculateTotalPerDayWithLimit(store_id, PAGE_SIZE, skip);

  //     res.status(200).json({ page, records });
  //   } catch (err) {
  //     res.status(500).send("WTF calculate");
  //   }
  // },
};
