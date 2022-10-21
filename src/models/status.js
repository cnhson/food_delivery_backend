const { sequelize } = require("../services/common");
const { DataTypes } = require("sequelize");

const Status = sequelize.define(
  "status",
  {
    id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = { Status };
