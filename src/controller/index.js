const { Role } = require("../models/role");
const { StoreType } = require("../models/store_type");
const { ProductType } = require("../models/product_type");
const { Account } = require("../models/account");
const { Menu } = require("../models/menu");
const { Store } = require("../models/store");
const { Transaction } = require("../models/transaction");
const { sequelize } = require("../utils/common");

module.exports = {
  Init: async function (req, res) {
    try {
      await sequelize.sync();
      res.json("Create all table successfully");
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },
};
