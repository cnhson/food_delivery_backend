const { sequelize } = require("../services/common");
const { DataTypes, QueryTypes } = require("sequelize");

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
    store_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "store",
        key: "id",
      },
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    proceed: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
  }
);

async function insertOrderDetail(order_id, product_id, quantity, store_id, price) {
  try {
    await orderDetail.create({
      order_id: order_id,
      product_id: product_id,
      quantity: quantity,
      store_id: store_id,
      price: price,
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getOrderDetailById(order_id) {
  return await sequelize.query(
    "select product_id, " +
      "(select name from menu m where od.product_id = m.id) 'product_name', store_id, " +
      "(select name from store s where od.store_id = s.id) 'store_name', quantity, price from order_detail od where od.order_id = '" +
      order_id +
      "'",
    {
      type: QueryTypes.SELECT,
    }
  );
}

async function getTotalPriceByOrderId(order_id) {
  const data = await sequelize.query(
    "select SUM(quantity * price) as 'total' from order_detail where order_id = '" + order_id + "'",
    {
      type: QueryTypes.SELECT,
    }
  );
  if (data) return data[0].total;
}

module.exports = { orderDetail, insertOrderDetail, getOrderDetailById, getTotalPriceByOrderId };
