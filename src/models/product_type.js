const { sequelize } = require("../services/common");
const { DataTypes, Op } = require("sequelize");

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
    store_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "store",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

async function insertProductType(id, name, store_id) {
  try {
    await ProductType.create({
      id: id,
      name: name,
      store_id,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getProductTypeByStoreId(store_id) {
  return await ProductType.findAll({
    attributes: ["id", "name"],
    where: {
      store_id: {
        [Op.eq]: store_id,
      },
    },
  });
}

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

module.exports = { ProductType, getProductTypeById, insertProductType, getProductTypeByStoreId };
