const { sequelize } = require("../services/common");
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

async function getProductTypeById(id) {
  try {
    const data = await ProductType.findAll({
      where: {
        id: id,
      },
    });
    if (data.length > 0) {
      return data[0];
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = { ProductType, getProductTypeById};
