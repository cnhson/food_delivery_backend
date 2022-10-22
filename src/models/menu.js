const { sequelize } = require("../services/common");
const { DataTypes } = require("sequelize");

const Menu = sequelize.define(
  "menu",
  {
    id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    store_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "store",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
    },
    type_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "product_type",
        key: "id",
      },
    },
    image: {
      type: DataTypes.BLOB,
    },
    price: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    out_of_stock: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    del_flag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

async function getProductByName(name){
  try{
    const data = await Menu.findAll({
      where:{
        name: {
          [Op.like]: "%"+name+"%",
        }
      },
    });
    if (data.length > 0) 
      return data;
    else 
      return null;
  } catch (err)
  {
    console.error(err);
    return null;
  }
}

async function getAllProduct(){
  try{
    const data = await Menu.findAll();
    if (data.length > 0) 
      return data;
    else 
      return null;
  } catch (err)
  {
    console.error(err);
    return null;
  }
}

module.exports = { Menu, getAllProduct, getProductByName };
