const {
  getAllProduct,
  getProductByName,
  addProduct,
  getProductDetail,
} = require("../models/menu");

const { getCommentsListFromStore } = require("../models/comment");

// store_id= store_id
// name= name
// description= description
// type_id= type_id
// image= image
// price= price

module.exports = {
  test: async function (req, res) {
    const oid = req.params.oid;
    console.log(oid);
    res.status(200).json("menu:" + oid);
  },

  createProduct: async function (req, res, next) {
    try {
      const store_id = req.body.store_id;
      const name = req.body.name;
      const description = req.body.description;
      const type_id = req.body.type_id;
      const image = req.body.image;
      const price = req.body.price;

      if (store_id === null || type_id === null || id === null) {
        res.status(200).json({ error: "Check id again" });
        return;
      } else {
        const result = await addProduct(
          store_id,
          name,
          description,
          type_id,
          image,
          price
        );
        if (result) {
          res.status(200).json("Add product successfully");
          return;
        } else {
          res.status(200).json("Fail to add product");
          return;
        }
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
};

//get first letters from string
function gfl(str) {
  const firstLetters = str
    .split(" ")
    .map((word) => word[0])
    .join("");

  return firstLetters;
}
