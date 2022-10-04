const { sequelize } = require("../utils/common");
const { DataTypes } = require("sequelize");

const Transaction = sequelize.define(
  "transaction",
  {
    id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    account_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "account",
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "menu",
        type: "id",
      },
    },
    timestamp: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = { Transaction };
