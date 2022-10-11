const { sequelize } = require("../services/common");
const { DataTypes } = require("sequelize");

const Account = sequelize.define(
  "account",
  {
    id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "role",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(255),
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    password: {
      type: DataTypes.STRING(50),
    },
    active_date: {
      type: DataTypes.STRING(25),
    },
    del_fag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    timestamp: {
      type: DataTypes.STRING(25),
    },
  },
  {
    timestamps: false,
  }
);

async function getAllAccount() {
  try {
    const datas = await Account.findAll();
    return datas;
  } catch (err) {
    console.log(err);
  }
}

module.exports = { Account, getAllAccount };
