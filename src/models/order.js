const { sequelize } = require("../services/common");
const { DataTypes, Op } = require("sequelize");
const { orderDetail } = require("./order_detail");

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
    price: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ship_fee: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    // product_id: {
    //   type: DataTypes.STRING(25),
    //   allowNull: false,
    //   primaryKey: true,
    //   references: {
    //     model: "menu",
    //     type: "id",
    //   },
    // },
    // quantity: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
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
  price,
  ship_fee,
  payment_method,
  timestamp
) {
  try {
    await Order.create({
      id: id,
      account_id: account_id,
      price: price,
      ship_fee: ship_fee,
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

async function getExistUserOrder(account_id, store_id, product_id) {
  try {
    const data = await Order.findOne({
      where: {
        id: {
          [Op.like]: "%S%" + store_id + "%P%" + product_id,
        },
        account_id: account_id,
      },
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
      include: {
        model: orderDetail,
        attributes: ["product_id", "quantity"],
      },
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
  getExistUserOrder,
  getUserOrderList,
};
