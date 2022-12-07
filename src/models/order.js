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
    store_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "store",
        key: "id",
      },
    },
    account_id: {
      type: DataTypes.STRING(10),
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

async function insertOrder(order_id, store_id, account_id, price, ship_fee, payment_method, timestamp) {
  try {
    await Order.create({
      id: order_id,
      store_id: store_id,
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

async function getOrderByAccount(account_id, order_id) {
  return await Comment.findAll({
    where: {
      [Op.and]: [
        {
          account_id: {
            [Op.eq]: account_id,
          },
        },
        {
          id: {
            [Op.eq]: order_id,
          },
        },
      ],
    },
  });
}

async function getUserOrderList(account_id, status) {
  try {
    const data = await sequelize.query(
      "select o.id, account_id, product_id,quantity,price, ship_fee, o.timestamp, payment_method, status from food_delivery.order o " +
        "inner join order_detail od on o.id = od.order_id where account_id = " +
        account_id +
        " and status like '%" +
        status +
        "%'",
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
    const data = await sequelize.query(
      "select o.id, account_id, product_id,quantity,price, ship_fee, o.timestamp, payment_method, status from food_delivery.order o " +
        "inner join order_detail od on o.id = od.order_id where status = 'received' and store_id = " +
        store_id,
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

async function calculateTotalPerDayWithLimit(store_id, limit) {
  try {
    const data = await sequelize.query(
      "SELECT Round(UNIX_TIMESTAMP(FROM_UNIXTIME(ord.timestamp/1000, '%Y-%m-%d'))*1000) 'otimestamp'," +
        " SUM(price + ship_fee * quantity ) 'total' FROM food_delivery.order ord " +
        "inner join order_detail od on ord.id = od.order_id " +
        "where store_id = '" +
        store_id +
        "' group by otimestamp order by otimestamp desc limit " +
        limit,
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

// async function calculateTotalPerDayWithLimit(store_id, limit, skip) {
//   try {
//     const data = await sequelize.query(
//       "SELECT FROM_UNIXTIME(ord.timestamp/1000, '%Y-%m-%d') 'only_date', SUM(price + ship_fee * quantity ) 'total' FROM food_delivery.order ord " +
//         "inner join order_detail od on ord.id = od.order_id " +
//         "where store_id = '" +
//         store_id +
//         "' group by only_date order by only_date limit " +
//         limit +
//         " offset " +
//         skip,
//       {
//         type: QueryTypes.SELECT,
//       }
//     );
//     return data;
//   } catch (err) {
//     console.log(err);
//     return 0;
//   }
// }

module.exports = {
  Order,
  insertOrder,
  getOrderByAccount,
  getUserOrderList,
  checkNewOrders,
  pendingOrder,
  receiveOrder,
  calculateTotalPerDayWithLimit,
};
