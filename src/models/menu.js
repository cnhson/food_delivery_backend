const { sequelize } = require("../services/common");
const { DataTypes, QueryTypes } = require("sequelize");
const { Op } = require("sequelize");
const { ProductType } = require("./product_type");
const { Store } = require("./store");

const Menu = sequelize.define(
  "menu",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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

async function addProduct(store_id, name, description, type_id, image, price) {
  try {
    await Menu.create({
      store_id: store_id,
      name: name,
      description: description,
      type_id: type_id,
      image: image,
      price: price,
      out_of_stock: false,
      del_flag: false,
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function getProductByName(name) {
  try {
    const data = await Menu.findAll({
      attributes: [
        "id",
        "store_id",
        "name",
        "description",
        "image",
        "price",
        "out_of_stock",
        "del_flag",
      ],
      include: {
        model: ProductType,
        attributes: ["name"],
      },
      where: {
        name: {
          [Op.like]: "%" + name + "%",
        },
      },
    });
    if (data.length > 0) return data;
    else return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getAllProduct() {
  try {
    const data = await Menu.findAll({
      attributes: [
        "id",
        "store_id",
        "name",
        "description",
        "image",
        "price",
        "out_of_stock",
        "del_flag",
      ],
      include: {
        model: ProductType,
        attributes: ["name"],
      },
    });
    if (data.length > 0) return data;
    else return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getProductDetail(id) {
  try {
    //Filter product info
    const p_info = await sequelize.query(
      "SELECT m.id, m.name, m.description 'des', p.name 'type', m.image, price, m.out_of_stock, m.del_flag " +
        "from menu m inner join product_type p on m.type_id = p.id where m.id = ?",
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      }
    );
    //Filter product store
    const p_store = await sequelize.query(
      "SELECT s.id 'sid', owner_id, s.name 'sname', s.address, s.description 'sdes', s.type_id 'stype', s.active_date " +
        "from menu m inner join store s on m.store_id = s.id where m.id = ?",
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      }
    );
    if (p_info.length > 0 && p_store.length > 0) {
      //Save before deleting id, bring [id] out to be the main key
      let id = p_info[0].id;
      delete p_info[0].id;
      let product_res = {
        id: id,
        info: p_info[0],
        store: p_store[0],
      };
      return product_res;
      //console.log(product_res);
    } else return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = {
  Menu,
  getAllProduct,
  getProductByName,
  addProduct,
  getProductDetail,
};
