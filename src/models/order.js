const { sequelize } = require("../services/common");
const { DataTypes, Op } = require("sequelize");

const Order = sequelize.define(
  "order",
  {
    id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "account",
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
      references: {
        model: "status",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

async function insertOrder(
  id,
  account_id,
  product_id,
  quantity,
  payment_method,
  timestamp
) {
  try {
    await Order.create({
      id: id,
      account_id: account_id,
      product_id: product_id,
      quantity: quantity,
      payment_method: payment_method,
      status: "received",
      timestamp: timestamp,
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getUserOrderByIds(id, account_id) {
  try {
    const data = await Order.findAll({
      where: {
        id: id,
        account_id: account_id,
      },
      attributes: ["id", "account_id", "product_id", "status"],
    });

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function checkExistUserOrder(id, account_id) {
  try {
    const data = await Order.findAll({
      where: {
        id: id,
        account_id: account_id,
      },
      attributes: ["id", "account_id", "product_id", "status"],
    });

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getUserOrderList(account_id, status) {
  try {
    const data = await Order.findAll({
      where: {
        account_id: account_id,
        status: {
          [Op.like]: "%" + status + "%",
        },
      },
    });

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = {
  Order,
  insertOrder,
  checkExistUserOrder,
  getUserOrderList,
};
