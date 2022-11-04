const { sequelize } = require("../services/common");
const { ProductType } = require("./product_type");
const { Store } = require("./store");
const { Menu } = require("./menu");
const { Order } = require("./order");
const { Comment } = require("./comment");
const { Account } = require("./account");

console.clear();

sequelize
  .authenticate()
  .then(console.log("\nConnect database successfully"))
  .catch((err) => {
    console.log(err);
  });

//Create association between models
Menu.hasMany(ProductType,
  {foreignKey: 'id', sourceKey: 'type_id'}
);
Menu.hasMany(Store,
  {foreignKey: 'id', sourceKey: 'store_id'}
);
Store.belongsTo(Menu,
  {foreignKey: 'store_id', sourceKey: 'id'}
);
ProductType.belongsTo(Menu,
  {foreignKey: 'type_id', sourceKey: 'id'}
);

console.log("\nAssociation done!!\n");