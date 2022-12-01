const { sequelize } = require("../services/common");
const { DataTypes, Op } = require("sequelize");

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
    createdAt: {
      type: DataTypes.STRING(25),
    },
    updatedAt: {
      type: DataTypes.STRING(25),
    },
  },
  {
    timestamps: false,
    // createdAt: false,
    // updatedAt: false,
  }
);

async function insertComment(store_id, order_id, account_id, comment, image, star, createAt, updateAt) {
  try {
    await Comment.create({
      store_id: store_id,
      order_id: order_id,
      account_id: account_id,
      comment: comment,
      image: image,
      star: star,
      createAt: createAt,
      updateAt: updateAt,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateComment(comment_id, comment, image, star, updateAt) {
  try {
    await Comment.update(
      {
        comment: comment,
        image: image,
        star: star,
        updateAt: updateAt,
      },
      {
        where: {
          id: {
            [Op.eq]: comment_id,
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

async function getCommetByIdAndAccount(account_id, comment_id) {
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
            [Op.eq]: comment_id,
          },
        },
      ],
    },
  });
}

module.exports = {
  Comment,
  insertComment,
  updateComment,
  getCommentsListFromStore,
  getCommetByIdAndAccount,
};
