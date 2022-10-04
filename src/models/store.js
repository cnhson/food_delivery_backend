const { sequelize } = require("../utils/common");
const { DataTypes } = require("sequelize");

const Store = sequelize.define(
  "store",
  {
    id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    owner_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "account",
        key: "id",
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
    },
    type_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: "store_type",
        key: "id",
      },
    },
    image: {
      type: DataTypes.BLOB,
    },
    active_date: {
      type: DataTypes.STRING(25),
    },
    timestamp: {
      type: DataTypes.STRING(25),
    },
  },
  {
    timestamps: false,
  }
);

module.exports = { Store };
