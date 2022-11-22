const { sequelize } = require("../services/common");
const { DataTypes } = require("sequelize");

const Store = sequelize.define(
  "store",
  {
    id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "account",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(255),
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
    },
    type_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: "store_type",
        key: "id",
      },
    },
    image: {
      type: DataTypes.BLOB,
    },
    active_date: {
      type: DataTypes.STRING(25),
    },
    timestamp: {
      type: DataTypes.STRING(25),
    },
  },
  {
    timestamps: false,
  }
);

async function insertStore(
  owner_id,
  name,
  address,
  description,
  type_id,
  timestamp
) {
  try {
    await Store.create({
      owner_id: owner_id,
      name: name,
      address: address,
      description: description,
      type_id: type_id,
      timestamp,
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function checkStoreByName(name) {
  try {
    const data = await Store.findAll({
      where: {
        name: name,
      },
    });
    if (data.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getStoreById(id) {
  try {
    const data = await Store.findAll({
      attributes: [
        `id`,
        `owner_id`,
        `name`,
        `address`,
        `description`,
        `type_id`,
        `image`,
        `active_date`,
        `timestamp`,
      ],
      where: {
        id: id,
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

module.exports = { Store, insertStore, checkStoreByName, getStoreById };
