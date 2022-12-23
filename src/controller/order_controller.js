const {
  insertOrder,
  getUserOrderWithCommentList,
  //calculateTotalPerDayWithLimit,
  updateStatus,
  getTotalOrdersByStatus,
  getRangeOrdersByStatus,
  getOrderByAccount,
  getOrderById,
  getTotalOrdersByStatusOfUser,
  checkProgressAndSetOrderStatus,
  checkproceedOrderDetail,
  proceedOrderDetail,
  progressOrder,
  getRangeOrdersByStatusOfUser,
} = require("../models/order");
const { insertOrderDetail, getOrderDetailById, getTotalPriceByOrderId } = require("../models/order_detail");
const crypto = require("crypto");
const { getAccountByIdAndRole } = require("../models/account");
const { pagination, checkNextAndPreviousPage } = require("../services/common");
const { getStatusById } = require("../models/status");
//const { getProductTypeById } = require("../models/product_type");
//const { getProductById } = require("../models/menu");
//const { getStoreById } = require("../models/store");

module.exports = {
  updateStatus: async function (req, res) {
    try {
      const order_id = req.body.order_id;
      const account_id = req.body.account_id;
      const status_id = req.body.status_id;

      // check if account is seller or account is customer who own this order
      const check = await getAccountByIdAndRole(account_id, "SEL");
      const checkCus = await getOrderByAccount(account_id, order_id);
      if (check.length === 0 && checkCus.length === 0) {
        res.status(500).json({ error: "You do not have permission to update the status of this order" });
        return;
      } else {
        // check if this order is accepted or not
        if (checkCus.length > 0) {
          const status = checkCus[0].status;
          if (status !== "NRY") {
            res
              .status(500)
              .json({ error: "This order cannot be canceled because the store owner has already accepted it" });
            return;
          }
        }

        const result = await updateStatus(order_id, status_id);
        if (result) {
          res.status(200).json({ message: "Update status successfully!" });
          return;
        }
        res.status(500).json({ error: "Update status failed or this order does not exists" });
        return;
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  proceedOrderWithStore: async function (req, res) {
    try {
      const store_id = req.body.store_id;
      const order_id = req.body.order_id;
      const product_id = req.body.product_id;

      const check = await checkproceedOrderDetail(order_id, product_id, store_id);
      if (check === 1) {
        checkProgressAndSetOrderStatus(order_id);
        res.status(200).json({ error: "Already proceeded" });
      } else {
        const proceed = await proceedOrderDetail(order_id, product_id, store_id);
        if (proceed) {
          const progress = await progressOrder(order_id);
          if (progress) {
            checkProgressAndSetOrderStatus(order_id);
            res.status(200).json({ message: "Order proceeding" });
          }
        }
      }
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
      const order_detail = req.body.order_detail;
      const payment_method = req.body.payment_method;
      const product_count = req.product_count;
      const ship_fee = req.body.ship_fee;
      const address = req.body.address;
      const timestamp = req.body.timestamp;

      //check if account exists
      const check = await getAccountByIdAndRole(account_id, "CUS");

      if (check.length === 0) {
        res.status(500).json({ error: "Account does not exists" });
        return;
      }

      // insert order into db
      const order = await insertOrder(
        order_id,
        account_id,
        address,
        ship_fee,
        payment_method,
        product_count,
        timestamp
      );
      if (!order) {
        res.status(500).json({ error: "Create order failed!" });
        return;
      }

      // insert order detail to db
      for (let i = 0; i < order_detail.length; i++) {
        const { product_id, store_id, price, quantity } = order_detail[i];
        const orderdetail_res = await insertOrderDetail(order_id, product_id, quantity, store_id, price);
        if (!orderdetail_res) {
          res.status(500).json({ error: "Create order detail failed!" });
          return;
        }
      }

      res.status(200).json({ message: "Create order successfully" });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getHistory: async function (req, res) {
    const user_id = req.query.user_id;
    const status_id = req.query.status_id;
    const page = Number(req.query.page);
    const size = Number(req.query.size);

    try {
      const data = pagination;
      data.currentPage = page;
      data.size = size;
      // get total order by status
      const totalOrders = await getTotalOrdersByStatusOfUser(user_id, status_id);

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
      const items = await getRangeOrdersByStatusOfUser(start, size, user_id, status_id);

      for (let i in items) {
        let ttprice = await getTotalPriceByOrderId(items[i].id);
        items[i].dataValues.totalprice = ttprice;
      }

      data.items = items;
      res.status(200).json(data);
    } catch (err) {
      res.status(500).send("Error");
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
      // for (let i = 0; i < items.length; i++) {
      //   const email = await getAccountByIdAndRole(items[i].account_id, "CUS");
      //   delete items[i].dataValues.account_id;
      //   items[i].dataValues.email = email[0].email;
      //   const status = await getStatusById(items[i].status);
      //   items[i].dataValues.status = status[0].name;
      // }
      data.items = items;

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getOrderDetail: async function (req, res) {
    const order_id = req.params.order_id;

    try {
      const order = await getOrderById(order_id);

      const orderdetail = await getOrderDetailById(order_id);

      let totalprice = 0;
      for (let item in orderdetail) {
        temp_total = orderdetail[item].quantity * parseFloat(orderdetail[item].price);
        totalprice += temp_total;
      }

      const data = {
        // id: order[0].id,
        // totalprice: totalprice,
        address: order[0].address,
        ship_fee: order[0].ship_fee,
        // timestamp: order[0].timestamp,
        // payment_method: order[0].payment_method,
        order_detail: orderdetail,
      };

      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
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
