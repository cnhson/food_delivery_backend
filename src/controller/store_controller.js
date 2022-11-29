const { insertStore, getStoreById, getUserStore, updateStoreById } = require("../models/store");

const { pendingOrder, checkNewOrders } = require("../models/order");
const { getProductByStore } = require("../models/menu");
module.exports = {
  pending: async function (req, res) {
    try {
      const order_id = req.body.order_id;
      const account_id = req.body.account_id;

      const pending_res = await pendingOrder(order_id, account_id);

      if (pending_res) {
        res.status(200).json({ message: "Changed to pending!!" });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getNewOrders: async function (req, res) {
    try {
      const store_id = req.body.store_id;

      if (store_id != null) {
        const neworders = await checkNewOrders(store_id);

        if (neworders) {
          res.status(200).json({ neworders });
        }
      } else {
        res.status(500).json("Store ID not found");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

  createStore: async function (req, res, next) {
    try {
      const id = crypto.randomBytes(3).toString("hex");
      const owner_id = req.session.User.id;
      const name = req.body.name;
      const address = req.body.address;
      const description = req.body.description;
      const type_id = req.body.type_id;
      const timestamp = req.body.timestamp;

      const result = await insertStore(id, owner_id, name, address, description, type_id, timestamp);

      if (result) {
        res.status(200).json({ message: "Create store successfully" });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getStore: async function (req, res) {
    try {
      const sid = req.params.sid;
      console.log(sid);
      if (sid != null) {
        const getstore = getStoreById(sid);
        const getproducts = getProductByStore(sid);
        const [store, products] = await Promise.all([getstore, getproducts]);
        //console.log([f_store, f_products]);
        if ([store, products]) {
          res.status(200).json({ store, products });
        }
      } else {
        res.status(500).json("ID not found");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

  loadUserStore: async function (req, res) {
    try {
      const owner_id = req.session.User.id;
      if (owner_id != null) {
        const storelist = await getUserStore(owner_id);

        if (storelist) {
          res.status(200).json({ storelist });
        } else if (storelist == null) {
          res.status(500).json("No store created yet");
        } else {
          res.status(500).json("User's ID is not belong to seller type");
        }
      } else {
        res.status(500).json("Please login!");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

  editStore: async function (req, res, next) {
    try {
      const id = req.body.id;
      const owner_id = req.session.User.id;
      const name = req.body.name;
      const address = req.body.address;
      const description = req.body.description;
      const type_id = req.body.type_id;
      const timestamp = req.body.timestamp;

      const result = await updateStoreById(id, owner_id, name, address, description, type_id, timestamp);

      if (result) {
        res.status(200).json({ message: "Edit store successfully" });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
