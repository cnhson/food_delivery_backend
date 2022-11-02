const { getAllProduct, getProductByName, addProduct } = require("../models/menu");

// store_id= store_id
// name= name
// description= description
// type_id= type_id
// image= image
// price= price


module.exports = {
  createProduct: async function(req, res, next)
  {
    try {
        const id = req.body.id;
        const store_id = req.body.store_id;
        const name= req.body.name;
        const description= req.body.description;
        const type_id= req.body.type_id;
        const image= req.body.image;
        const price= req.body.price;

      if (store_id === null || type_id === null || id === null ) {
        res.status(200).json({ error: "Check id again" });
        return;
      }
      else
      {
        const result = await addProduct(
            id,
            store_id,
            name,
            description,
            type_id,
            image,
            price,
          );
        if(result)
        {
          res.status(200).json("Add product successfully");
          return;
        }
        else{
          res.status(200).json("Fail to add product");
          return;
        }
      }
      } 
  catch (err) {
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
