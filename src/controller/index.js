const { Role, insertDefaultRole } = require("../models/role");
const { StoreType } = require("../models/store_type");
const { ProductType } = require("../models/product_type");
const { Account } = require("../models/account");
const { Menu } = require("../models/menu");
const { Store } = require("../models/store");
const { Order } = require("../models/order");
const { Comment } = require("../models/comment");
const { sequelize } = require("../services/common");

module.exports = {
  Init: async function (req, res) {
    try {
      await sequelize.sync();
      await insertDefaultRole();
      res.json("Create all table successfully");
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },
};
