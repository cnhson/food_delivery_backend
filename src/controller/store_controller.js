const { insertStore , checkStoreByName } = require("../models/store");

module.exports = {

createStore: async function (req, res, next) {
    try {
    //   owner_id: owner_id,
    //   name: name,
    //   address: address,
    //   description: description,
    //   type_id: type_id,
    //   timestamp,

      const owner_id = req.body.owner_id;
      const name = req.body.name;
      const address = req.body.address;
      const description = req.body.description;
      const type_id = req.body.type_id;
      const timestamp = req.body.timestamp;
        
        // Check store's name
        if(namecheck!= false){
        // Insert store into database
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
        }
    } catch (err) {
      res.status(500).send(err);
    }
  },

}