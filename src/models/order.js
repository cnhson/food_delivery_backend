const { sequelize } = require("../services/common");
const { DataTypes, Op, QueryTypes, Sequelize } = require("sequelize");
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
    address: {
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

async function insertOrder(order_id, store_id, account_id, price, address, ship_fee, payment_method, timestamp) {
  try {
    await Order.create({
      id: order_id,
      store_id: store_id,
      account_id: account_id,
      price: price,
      address: address,
      ship_fee: ship_fee,
      payment_method: payment_method,
      status: "NRY",
      timestamp: timestamp,
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getOrderByAccount(account_id, order_id) {
  return await Order.findAll({
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

async function getTotalOrdersByStatus(store_id, status_id) {
  const total = await Order.findAll({
    attributes: [[Sequelize.fn("COUNT", Sequelize.col("*")), "total_orders"]],
    where: {
      [Op.and]: [
        {
          status: {
            [Op.eq]: status_id,
          },
        },
        {
          store_id: {
            [Op.eq]: store_id,
          },
        },
      ],
    },
  });
  return total[0].dataValues.total_orders;
}

async function getRangeOrdersByStatus(start, size, store_id, status_id) {
  return await Order.findAll({
    where: {
      [Op.and]: [
        {
          status: {
            [Op.eq]: status_id,
          },
        },
        {
          store_id: {
            [Op.eq]: store_id,
          },
        },
      ],
    },
    order: [["timestamp", "DESC"]],
    offset: start,
    limit: size,
  });
}

async function getUserOrderWithCommentList(account_id, status) {
  try {
    const data = await sequelize.query(
      "select o.id, o.account_id, product_id, quantity, price, ship_fee, o.timestamp, payment_method, status, " +
        "c.id 'commentid', c.comment 'comment', c.star 'star', c.timestamp 'ctimestamp', c.updated 'cupdated' " +
        "from food_delivery.order o inner join order_detail od on o.id = od.order_id " +
        "left join comment c on o.id = c.order_id " +
        "where o.account_id = '" +
        account_id +
        "' and status like '%" +
        status +
        "%'",
      {
        type: QueryTypes.SELECT,
      }
    );

    for (let item in data) {
      var c = {
        commentid: data[item].commentid,
        comment: data[item].comment,
        star: data[item].star,
        ctimestamp: data[item].ctimestamp,
        cupdated: data[item].cupdated,
      };

      if (data[item].commentid != null) {
        data[item]["c"] = c;
      }

      delete data[item].commentid;
      delete data[item].comment;
      delete data[item].star;
      delete data[item].ctimestamp;
      delete data[item].cupdated;
    }

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

async function updateStatus(id, status_id) {
  try {
    await Order.update(
      {
        status: status_id,
      },
      {
        where: {
          id: {
            [Op.eq]: id,
          },
        },
      }
    );

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
        "inner join order_detail od on o.id = od.order_id where status = 'noticed' and store_id = " +
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
  getUserOrderWithCommentList,
  checkNewOrders,
  pendingOrder,
  updateStatus,
  calculateTotalPerDayWithLimit,
  getTotalOrdersByStatus,
  getRangeOrdersByStatus,
};
