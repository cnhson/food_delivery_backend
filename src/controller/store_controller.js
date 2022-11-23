const {
  insertStore,
  checkStoreByName,
  getStoreById,
  updateStoreById,
} = require("../models/store");
const { getProductByStore } = require("../models/menu");
module.exports = {
  createStore: async function (req, res, next) {
    try {
      const owner_id = req.body.owner_id;
      const name = req.body.name;
      const address = req.body.address;
      const description = req.body.description;
      const type_id = req.body.type_id;
      const timestamp = req.body.timestamp;

      const result = await insertStore(
        owner_id,
        name,
        address,
        description,
        type_id,
        timestamp
      );

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

  editStore: async function (req, res, next) {
    try {
      const id = req.body.id;
      const name = req.body.name;
      const address = req.body.address;
      const description = req.body.description;
      const type_id = req.body.type_id;
      const timestamp = req.body.timestamp;

      const result = await updateStoreById(
        id,
        name,
        address,
        description,
        type_id,
        timestamp
      );

      if (result) {
        res.status(200).json({ message: "Edit store successfully" });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
