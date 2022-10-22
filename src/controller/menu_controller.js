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
          console.log("successfully");
          return;
        } 
    catch (err) {
        console.log(err);
        res.status(500).send(err);
        }
    },
};
