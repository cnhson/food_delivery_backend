const {
  getAllProduct,
  getProductById,
  addProduct,
  getProductDetail,
  updateProductById,
  getProductByStore,
  getProductByIdAndStoreId,
} = require("../models/menu");

const { getCommentsListFromStore } = require("../models/comment");
const {
  insertProductType,
  getProductTypeByStoreId,
  getProductTypeById,
  getProductTypeByIdAndStoreId,
  editProductType,
} = require("../models/product_type");
const { getStoreById } = require("../models/store");

module.exports = {
  test: async function (req, res) {
    const oid = req.params.oid;
    console.log(oid);
    res.status(200).json("menu:" + oid);
  },

  createProduct: async function (req, res) {
    const store_id = req.body.store_id;
    const name = req.body.name;
    const description = req.body.description;
    const type_id = req.body.type_id;
    const image = req.body.image;
    const price = req.body.price;

    try {
      // check store id if exists
      const check = await getStoreById(store_id);
      if (check.length === 0) {
        res.status(402).json({ error: "Store does not exists" });
        return;
      }

      const result = await addProduct(store_id, name, description, type_id, image, price);
      if (result) {
        res.status(200).json({ message: "Create new product successfully!" });
      } else {
        res.status(500).json({ error: "Create new product Failed!" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  editProduct: async function (req, res, next) {
    try {
      const id = req.body.id;
      const store_id = req.body.store_id;
      const name = req.body.name;
      const description = req.body.description;
      const type_id = req.body.type_id;
      const image = req.body.image;
      const price = req.body.price;

      // check if store_id is own this product
      const check = await getProductByIdAndStoreId(id, store_id);
      if (check.length === 0) {
        res.status(500).json({ error: "This product does not belong to the store" });
        return;
      }

      // edit product
      const result = await updateProductById(id, name, description, image, type_id, price);
      if (result) {
        res.status(200).json({ message: "Edit product successfully" });
        return;
      } else {
        res.status(200).json({ error: "Fail to edit product" });
        return;
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  updateProductType: async function (req, res, next) {
    try {
      const id = req.body.id;
      const store_id = req.body.store_id;
      const name = req.body.name;

      // check if store_id is own this product type
      const check = await getProductTypeByIdAndStoreId(id, store_id);
      if (check.length === 0) {
        res.status(500).json({ error: "This product does not belong to the store" });
        return;
      }

      // edit product
      const result = await editProductType(id, name);
      if (result) {
        res.status(200).json({ message: "Edit product successfully" });
        return;
      } else {
        res.status(200).json({ error: "Fail to edit product" });
        return;
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  getAllProducts: async function (req, res) {
    const storeId = req.params.storeId;
    try {
      const data = await getProductByStore(storeId);
      if (data.length === 0) {
        res.status(200).json(data);
        return;
      }

      for (let i = 0; i < data.length; i++) {
        const typeName = await getProductTypeById(data[i].type_id);
        data[i].dataValues.type = typeName[0].name;
      }

      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  getProduct: async function (req, res) {
    const product_id = req.params.product_id;
    try {
      const data = await getProductById(product_id);
      res.status(200).json(data);
    } catch (err) {
      console.log("err");
      res.status(500).send(err);
    }
  },

  getProductType: async function (req, res) {
    const type_id = req.params.type_id;
    try {
      const data = await getProductTypeById(type_id);
      res.status(200).json(data);
    } catch (err) {
      console.log("err");
      res.status(500).send(err);
    }
  },

  productInfo: async function (req, res) {
    try {
      let productid = req.params.pid;
      if (productid === null) {
        res.status(200).json({ error: "Please input a product id" });
        return;
      } else {
        let product = await getProductDetail(productid);
        if (product != null) {
          let feedback = await getCommentsListFromStore(product.store.sid);
          const feedbackcount = feedback.length;
          res.status(200).json({ product, feedbackcount, feedback });
          return;
        } else {
          res.status(200).json("Product not found");
          return;
        }
      }
    } catch (err) {
      console.log("err");
      res.status(500).send(err);
    }
  },

  createProductType: async function (req, res) {
    const id = req.body.id;
    const name = req.body.name;
    const store_id = req.body.store_id;

    try {
      const result = await insertProductType(id, name, store_id);
      if (result) {
        res.status(200).json({ message: "Create product type successfully!" });
      } else {
        res.status(500).json({ error: "Create product type failed!" });
      }
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  getAllProductType: async function (req, res) {
    const storeId = req.params.storeId;

    try {
      const result = await getProductTypeByStoreId(storeId);
      res.status(200).json(result);
    } catch (err) {
      res.send(err);
    }
  },
};

//get first letters from string
function gfl(str) {
  const firstLetters = str
    .split(" ")
    .map((word) => word[0])
    .join("");

  return firstLetters;
}
