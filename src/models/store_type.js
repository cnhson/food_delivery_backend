const { sequelize } = require("../utils/common");
const { DataTypes } = require("sequelize");

const StoreType = sequelize.define(
    "store_type",
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

module.exports = { StoreType };
