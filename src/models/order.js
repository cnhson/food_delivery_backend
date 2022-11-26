const { sequelize } = require("../services/common");
const { DataTypes, Op, QueryTypes } = require("sequelize");
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

async function getExistUserOrder(account_id, product_id) {
  try {
    const data = await sequelize.query(
      "SELECT * FROM food_delivery.order o inner join order_detail od on o.id = od.order_id where account_id = " +
        account_id +
        " and product_id = " +
        product_id +
        " ORDER BY o.id DESC LIMIT 1",
      {
        type: QueryTypes.SELECT,
      }
    );
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

async function pendingOrder(id, account_id) {
  try {
    await Order.update({
      status: "pending",
      where: {
        id: id,
        account_id: account_id,
      },
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function receiveOrder(id, account_id) {
  try {
    await Order.update({
      status: "done",
      where: {
        id: id,
        account_id: account_id,
      },
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function checkNewOrders(store_id) {
  try {
    const data = await Order.findAll({
      attributes: [
        "id",
        "account_id",
        "price",
        "ship_fee",
        "timestamp",
        "payment_method",
        "status",
      ],
      include: {
        model: orderDetail,
        attributes: ["product_id", "quantity"],
      },
      where: {
        status: "received",
        id: {
          [Op.like]: "%" + store_id + "%",
        },
      },
    });
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function calculateTotal(store_id, mil1, mil2) {
  try {
    const data = await sequelize.query(
      "select sum(price*quantity) 'total_sum' from food_delivery.order o inner join order_detail od on o.id = od.order_id where o.id like '%S%" +
        store_id +
        "%O%' and (timestamp between " +
        mil1 +
        " and " +
        mil2 +
        ")",
      {
        type: QueryTypes.SELECT,
      }
    );
    return data;
  } catch (err) {
    console.log(err);
    return 0;
  }
}

module.exports = {
  Order,
  insertOrder,
  getExistUserOrder,
  getUserOrderList,
  calculateTotal,
  checkNewOrders,
  pendingOrder,
  receiveOrder,
};
