const { sequelize } = require("../services/common");
const { DataTypes, Op, QueryTypes, Sequelize } = require("sequelize");
const { orderDetail } = require("./order_detail");
const { query } = require("express");

const Order = sequelize.define(
  "order",
  {
    id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    account_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: "account",
        key: "id",
      },
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
    product_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
  }
);

async function insertOrder(order_id, account_id, address, ship_fee, payment_method, product_count, timestamp) {
  try {
    await Order.create({
      id: order_id,
      account_id: account_id,
      address: address,
      ship_fee: ship_fee,
      payment_method: payment_method,
      product_count: product_count,
      status: "NRY",
      timestamp: timestamp,
      product_count: product_count,
      progress: 0,
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

async function getTotalOrdersByStatusOfUser(user_id, status_id) {
  const total = await sequelize.query(
    "select count(id) as 'total_count' from food_delivery.order where account_id = '" +
      user_id +
      "' and status = '" +
      status_id +
      "'",
    {
      type: QueryTypes.SELECT,
    }
  );
  return total[0].total_count;
}

async function checkproceedOrderDetail(order_id, product_id, store_id) {
  try {
    const data = await sequelize.query(
      "select proceed from food_delivery.order_detail where order_id = '" +
        order_id +
        "' and product_id = '" +
        product_id +
        "' and store_id ='" +
        store_id +
        "'",
      {
        type: QueryTypes.SELECT,
      }
    );
    return data[0].proceed;
  } catch (error) {
    return error;
  }
}

async function proceedOrderDetail(order_id, product_id, store_id) {
  try {
    await orderDetail.update(
      { proceed: 1 },
      {
        where: {
          order_id: order_id,
          product_id: product_id,
          store_id: store_id,
        },
      }
    );
    return true;
  } catch (error) {
    return error;
  }
}

async function progressOrder(order_id) {
  try {
    await sequelize.query("update food_delivery.order set progress = progress + 1 where id = '" + order_id + "'", {
      type: QueryTypes.UPDATE,
    });
    return true;
  } catch (error) {
    return error;
  }
}

async function checkProgressAndSetOrderStatus(order_id) {
  try {
    const equal = await sequelize.query(
      "select progress = product_count as 'is_true' from food_delivery.order where id = '" + order_id + "'",
      {
        type: QueryTypes.SELECT,
      }
    );

    if (equal[0].is_true === 1) {
      await sequelize.query("update food_delivery.order set status = 'SHP' where id = '" + order_id + "'", {
        type: QueryTypes.SELECT,
      });
      return true;
    } else {
      await sequelize.query("update food_delivery.order set status = 'RCD' where id = '" + order_id + "'", {
        type: QueryTypes.SELECT,
      });
      return true;
    }
  } catch (error) {
    return error;
  }
}

// async function deproceedOrderDetail(order_id, store_id, product_id) {
//   try {
//     await orderDetail.update(
//       { proceed: 0 },
//       {
//         where: {
//           order_id: order_id,
//           product_id: product_id,
//           store_id: store_id,
//         },
//       }
//     );
//     return true;
//   } catch (error) {
//     return false;
//   }
// }

async function getTotalOrdersByStatus(store_id, status_id) {
  const total = await sequelize.query(
    "select count(o.id) as 'total_orders' from food_delivery.order o inner join order_detail od on o.id = od.order_id where store_id = '" +
      store_id +
      "' and status = '" +
      status_id +
      "'",
    {
      type: QueryTypes.SELECT,
    }
  );
  return total[0].total_orders;
}

async function getRangeOrdersByStatus(start, size, store_id, status_id) {
  const data = await sequelize.query(
    "SELECT o.id, (select email from account a where a.id = o.account_id) 'email', timestamp, payment_method, product_id, " +
      "(select name from menu m where m.id = product_id) 'product', " +
      "(select name from status s where s.id = o.status) 'status', progress, proceed " +
      "FROM food_delivery.order o inner join order_detail od on o.id = od.order_id " +
      "where store_id = '" +
      store_id +
      "' order by timestamp DESC limit " +
      size +
      " offset " +
      start,
    {
      type: QueryTypes.SELECT,
    }
  );
  return data;
}

async function getRangeOrdersByStatusOfUser(start, size, user_id, status_id) {
  return await Order.findAll({
    where: {
      [Op.and]: [
        {
          status: {
            [Op.eq]: status_id,
          },
        },
        {
          account_id: {
            [Op.eq]: user_id,
          },
        },
      ],
    },
    order: [["timestamp", "DESC"]],
    offset: start,
    limit: size,
  });
}

async function getOrderById(order_id) {
  return await Order.findAll({
    raw: true,
    attributes: ["id", "address", "ship_fee", "timestamp", "payment_method"],
    where: {
      id: {
        [Op.eq]: order_id,
      },
    },
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
  progressOrder,
  proceedOrderDetail,
  checkproceedOrderDetail,
  checkProgressAndSetOrderStatus,
  //deproceedOrderDetail,
  getOrderByAccount,
  getUserOrderWithCommentList,
  updateStatus,
  //calculateTotalPerDayWithLimit,
  getTotalOrdersByStatus,
  getRangeOrdersByStatus,
  getOrderById,
  getRangeOrdersByStatusOfUser,
  getTotalOrdersByStatusOfUser,
};
