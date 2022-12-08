const {
  insertOrder,
  getUserOrderWithCommentList,
  calculateTotalPerDayWithLimit,
  receiveOrder,
  getTotalOrdersByStatus,
  getRangeOrdersByStatus,
} = require("../models/order");
const { insertOrderDetail } = require("../models/order_detail");
const crypto = require("crypto");
const { getAccountByIdAndRole } = require("../models/account");
const { pagination, checkNextAndPreviousPage } = require("../services/common");
const { getStatusById } = require("../models/status");

module.exports = {
  //If customer has received then use this func to change status to "received"
  receiveStatusChange: async function (req, res) {
    try {
      const order_id = req.body.order_id;
      const account_id = req.body.account_id;

      const receive_res = await receiveOrder(order_id, account_id);
      if (receive_res) res.status(200).json({ message: "Status change to received!!" });
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
      const account_id = req.body.account_id;
      const store_id = req.body.store_id;
      const order_detail = req.body.order_detail;
      const payment_method = req.body.payment_method;
      const ship_fee = req.body.ship_fee;
      const price = req.body.price;
      const timestamp = req.body.timestamp;

      //check if account exists
      const check = await getAccountByIdAndRole(account_id, "CUS");

      if (check.length === 0) {
        res.status(500).json({ error: "Account does not exists" });
        return;
      }

      console.log(order_detail);

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
      const account_id = req.body.account_id;
      let status = "";

      if (req.params.status != "any") {
        status = req.params.status;
      }

      const orderlist = await getUserOrderWithCommentList(account_id, status);

      if (orderlist.length != 0) {
        res.status(200).json(orderlist);
      } else {
        res.status(200).json({ message: "Error " });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getStoreOrders: async function (req, res) {
    const store_id = req.query.store_id;
    const status_id = req.query.status_id;
    const page = Number(req.query.page);
    const size = Number(req.query.size);

    try {
      const data = pagination;
      data.currentPage = page;
      data.size = size;

      // get total orders by status
      const totalOrders = await getTotalOrdersByStatus(store_id, status_id);
      data.total = totalOrders;

      // get total pages
      const totalPages = Math.ceil(totalOrders / size);
      data.pages = totalPages == 0 ? 1 : totalPages;

      // check if current page has next page and previous page
      const check = checkNextAndPreviousPage(page, totalPages);
      data.hasNext = check.hasNext;
      data.hasPrevious = check.hasPrevious;

      // get items
      const start = Number(size * (page - 1));
      const items = await getRangeOrdersByStatus(start, size, store_id, status_id);

      // get email by account id and status by status id
      for (let i = 0; i < items.length; i++) {
        const email = await getAccountByIdAndRole(items[0].account_id, "CUS");
        delete items[0].dataValues.account_id;
        items[0].dataValues.email = email[0].email;
        const status = await getStatusById(items[0].status);
        items[0].dataValues.status = status[0].name;
      }
      data.items = items;

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Test output random ids
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
