const { sequelize } = require("../services/common");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    active_date: {
      type: DataTypes.STRING(25),
    },
  }
  
);

async function getAccountById(id) {
  try {
    const data = await Account.findAll({
      where: {
        id: id,
      },
    });
    if (data.length > 0) {
      return data[0];
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = { userDetail, getAccountById };
