const { sequelize } = require("../utils/common");
const { DataTypes } = require("sequelize");

const ProductType = sequelize.define(
    "product_type",
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

module.exports = { ProductType };
