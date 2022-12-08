const { sequelize } = require("../services/common");
const { DataTypes, Op } = require("sequelize");

const Status = sequelize.define(
  "status",
  {
    id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

async function insertDefaultStatus() {
  await Status.upsert({
    id: "NRY",
    name: "not received yet",
  });
  await Status.upsert({
    id: "RCD",
    name: "received",
  });
  await Status.upsert({
    id: "SHP",
    name: "shipping",
  });
  await Status.upsert({
    id: "SUC",
    name: "success",
  });
  await Status.upsert({
    id: "FAL",
    name: "failed",
  });
}

async function getStatusById(status_id) {
  return await Status.findAll({
    attributes: ["name"],
    where: {
      id: {
        [Op.eq]: status_id,
      },
    },
  });
}

module.exports = { Status, insertDefaultStatus, getStatusById };
