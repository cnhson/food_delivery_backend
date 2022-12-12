const { sequelize } = require("../services/common");
const { DataTypes, Op } = require("sequelize");

const orderDetail = sequelize.define(
  "order_detail",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "order",
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
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

async function insertOrderDetail(order_id, product_id, quantity) {
  try {
    await orderDetail.create({
      order_id: order_id,
      product_id: product_id,
      quantity: quantity,
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getOrderDetailById(order_id) {
  return await orderDetail.findAll({
    attributes: ["product_id", "quantity"],
    where: {
      order_id: {
        [Op.eq]: order_id,
      },
    },
  });
}

module.exports = { orderDetail, insertOrderDetail, getOrderDetailById };
