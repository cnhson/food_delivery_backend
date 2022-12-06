const { getAllProduct, getProductByName, addProduct, getProductDetail, updateProductById } = require("../models/menu");

const { getCommentsListFromStore } = require("../models/comment");
const { insertProductType, getProductTypeByStoreId } = require("../models/product_type");
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
      const out_of_stock = req.body.out_of_stock;
      const del_flag = req.body.del_flag;

      const result = await editProduct(id, store_id, name, description, type_id, image, price, out_of_stock, del_flag);
      if (result) {
        res.status(200).json("Edit product successfully");
        return;
      } else {
        res.status(200).json("Fail to edit product");
        return;
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  listAllProducts: async function (req, res) {
    try {
      let productlist = await getAllProduct();
      if (productlist === null) {
        res.status(200).json({ error: "No products in the database" });
        return;
      } else {
        res.status(200).json(productlist);
        return;
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  findProduct: async function (req, res) {
    try {
      let productname = req.params.name;
      if (productname === null) {
        res.status(200).json({ error: "Please input a product name" });
        return;
      } else {
        let result = await getProductByName(productname);
        if (result != null) {
          res.status(200).json(result);
          return;
        } else {
          res.status(200).json("No product found");
          return;
        }
      }
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
