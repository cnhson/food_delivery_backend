require("dotenv").config();
const { Sequelize } = require("sequelize");

const db_config = {
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
};

const sequelize = new Sequelize(db_config.database, db_config.user, db_config.password, {
  host: db_config.host,
  dialect: "mysql",
  define: {
    freezeTableName: true,
  },
  timezone: "+07:00",
});

module.exports = { db_config, sequelize };
