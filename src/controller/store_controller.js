const { insertStore, getStoreById, getUserStore, updateStoreById, getAll } = require("../models/store");
const { getCommentsListFromStore } = require("../models/comment");
const { checkNewOrders } = require("../models/order");
const { getProductByStore } = require("../models/menu");
const { getAllType } = require("../models/store_type");
module.exports = {
  getAllStores: async function (req, res) {
    try {
      const data = await getAll();
      if (data) {
        res.status(200).json(data);
      }
    } catch (err) {
      res.status(500).json(err);
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

  createStore: async function (req, res) {
    try {
      const id = req.body.id;
      const name = req.body.name;
      const address = req.body.address;
      const description = req.body.description;
      const image = req.body.image;
      const type_id = req.body.type_id;
      const timestamp = req.body.timestamp;
      const owner_id = req.body.owner_id;

      const result = await insertStore(id, owner_id, name, address, description, image, type_id, timestamp);

      if (result) {
        res.status(200).json({ message: "Create store successfully" });
      }
    } catch (err) {
      console.log(err);
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
      const owner_id = req.body.owner_id;
      if (owner_id != null) {
        const storelist = await getUserStore(owner_id);
        console.log(storelist);
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

  editStore: async function (req, res) {
    try {
      const id = req.body.id;
      const owner_id = req.owner_id;
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

  getAllType: async function (req, res) {
    try {
      const allType = await getAllType();
      res.status(200).json(allType);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
