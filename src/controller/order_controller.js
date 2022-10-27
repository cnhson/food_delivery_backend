const { insertOrder } = require("../models/order");

module.exports = {

createOrder: async function (req, res, next) {
    try {

        // account_id: account_id,
        // product_id: product_id,
        // quantity: quantity,
        // payment_method: payment_method,
        // status: status,
        // timestamp,

      const account_id = req.body.account_id;
      const product_id = req.body.product_id;
      const quantity = req.body.quantity;
      const payment_method = req.body.payment_method;
      const status = req.body.status;
      const timestamp = req.body.timestamp;
        
        // Insert order into database
        const result = await insertOrder(
            account_id,
            product_id,
            quantity,
            payment_method,
            status,
            timestamp
          );

          if (result) {
            res.status(200).json({ message: "Create order successfully" });
          } 
        
    } catch (err) {
      res.status(500).send(err);
    }
  },
}