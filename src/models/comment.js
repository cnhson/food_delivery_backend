const { sequelize } = require("../services/common");
const { DataTypes } = require("sequelize");

const Comment = sequelize.define(
  "comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    store_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "store",
        key: "id",
      },
    },
    order_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "order",
        key: "id",
      },
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "account",
        key: "id",
      },
    },
    comment: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.BLOB,
    },
    star: {
      type: DataTypes.INTEGER,
    },
    timestamp: {
      type: DataTypes.STRING(25),
    },
    createdAt: {
      type: DataTypes.STRING(25),
    },
    updatedAt: {
      type: DataTypes.STRING(25),
    },
  },
  {
    timestamp: false,
  }
);

async function insertComment(
  store_id,
  order_id,
  account_id,
  comment,
  image,
  star,
  timestamp,
  createdAt
) {
  try {
    await Comment.create({
      store_id: store_id,
      order_id: order_id,
      account_id: account_id,
      comment: comment,
      image: image,
      star: star,
      timestamp: timestamp,
      createdAt: createdAt,
      updatedAt: "0",
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateComment(
  store_id,
  order_id,
  account_id,
  comment,
  image,
  star,
  timestamp,
  updatedAt
) {
  try {
    await Comment.update(
      {
        comment: comment,
        image: image,
        star: star,
        timestamp: timestamp,
        updatedAt: updatedAt,
      },
      {
        where: {
          store_id: store_id,
          order_id: order_id,
          account_id: account_id,
        },
      }
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getCommentsListFromStore(store_id) {
  try {
    const data = await Comment.findAll({
      where: {
        store_id: store_id,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = {
  Comment,
  insertComment,
  updateComment,
  getCommentsListFromStore,
};
