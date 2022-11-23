const { sequelize } = require("../services/common");
const { DataTypes } = require("sequelize");

const Account = sequelize.define(
  "account",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
      type: DataTypes.STRING(100),
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

async function insertAccount(role_id, name, email, password, timestamp) {
  try {
    await Account.create({
      role_id: role_id,
      name: name,
      email: email,
      password: password,
      del_fag: false,
      timestamp,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getAccountByEmail(email) {
  try {
    const data = await Account.findAll({
      where: {
        email: email,
      },
    });
    if (data.length > 0) {
      return data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = { Account, insertAccount, getAccountByEmail};
