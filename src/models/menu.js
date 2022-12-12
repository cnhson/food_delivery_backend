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
      type: DataTypes.STRING(64),
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
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function getProductByStore(store_id) {
  return await Menu.findAll({
    where: {
      store_id: store_id,
    },
  });
}

async function getProductById(id) {
  try {
    const data = await sequelize.query(
      "select m.id, m.store_id, m.name, type_id, pt.name 'type_name', m.description, image, price, out_of_stock, del_flag from menu m " +
        "inner join product_type pt on m.type_id = pt.id where m.id = " +
        id,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (data.length > 0) return data;
    else return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getAllProduct() {
  try {
    const data = await sequelize.query(
      "select m.id, store_id, m.name, type_id, pt.name 'type_name', m.description, image, price, out_of_stock, del_flag from menu m " +
        "inner join product_type pt on m.type_id = pt.id",
      {
        type: QueryTypes.SELECT,
      }
    );
    if (data.length > 0) return data;
    else return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function updateProductById(id, name, description, image, type_id, price) {
  try {
    await Menu.update(
      {
        name: name,
        description: description,
        type_id: type_id,
        image: image,
        price: price,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function getProductByIdAndStoreId(id, store_id) {
  return await Menu.findAll({
    where: {
      [Op.and]: [
        {
          id: {
            [Op.eq]: id,
          },
          store_id: {
            [Op.eq]: store_id,
          },
        },
      ],
    },
  });
}

async function getMostOrderedProductsDesc() {
  try {
    const data = await sequelize.query(
      "select m.id 'pid', " +
        "(SELECT count(product_id) 'amount' FROM food_delivery.order_detail od where od.product_id = m.id " +
        "group by product_id order by amount desc ) 'ord_amount', " +
        "(SELECT s.name FROM food_delivery.store s where s.id = m.store_id) 'store_name' " +
        ", name, description, " +
        "(SELECT pt.name FROM food_delivery.product_type pt where pt.id = m.type_id) 'type' " +
        ",image, price from menu m order by ord_amount desc ",
      {
        type: QueryTypes.SELECT,
      }
    );

    return data;
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
        "from menu m inner join product_type p on m.type_id = p.id where m.id = " +
        id,
      {
        type: QueryTypes.SELECT,
      }
    );
    //Filter product store
    const p_store = await sequelize.query(
      "SELECT s.id 'sid', owner_id, s.name 'sname', s.address, s.description 'sdes', s.type_id 'stype', s.active_date " +
        "from menu m inner join store s on m.store_id = s.id where m.id = " +
        id,
      {
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
  getProductById,
  addProduct,
  getProductDetail,
  getProductByStore,
  updateProductById,
  getProductByIdAndStoreId,
  getMostOrderedProductsDesc,
};
