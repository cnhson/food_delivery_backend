const { sequelize } = require("../services/common");
const { DataTypes } = require("sequelize");

const orderDetail = sequelize.define(
  "order_detail",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ordder_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "order",
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      primaryKey: true,
      references: {
        model: "menu",
        type: "id",
      },
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = { orderDetail };
