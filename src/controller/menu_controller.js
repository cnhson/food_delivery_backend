const { getAllProduct, getProductByName } = require("../models/menu");

module.exports = {
  listAllProducts: async function (req, res) {
    try {
        let productlist = await getAllProduct();
        if (productlist === null) {
          res.status(200).json({ error: "No products in the database" });
          return;
        }
          res.status(200).json(productlist);
          //console.log("successfully");
          return;
        } 
    catch (err) {
        console.log(err);
        res.status(500).send(err);
        }
    },

  findProduct: async function (req, res) {
    try {
        let productname =  req.params.name;
        if (productname === null) {
          res.status(200).json({ error: "Please input a product name" });
          return;
        } else
          {
            let result = await getProductByName(productname);
            if(result != null)
            {
              res.status(200).json(result);
              //console.log("successfully");
              return;
            }
            else
            {
              res.status(200).json("No product found");
              //console.log("successfully");
              return;
            }
          }
        } 
    catch (err) {
        console.log("err");
        res.status(500).send(err);
        }
    },
};
