const Joi = require("joi");

const email = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  })
  .required();

const name = Joi.string().pattern(new RegExp("^[a-zA-Z]{3,250}$")).required();
const password = Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()+-/]{8,100}$")).required();
const product_id = Joi.number().min(0).required();
const account_id = Joi.number().min(0).required();
const store_id = Joi.string().pattern(new RegExp("^[a-zA-Z]{1,25}$")).required();
const order_id = Joi.string().pattern(new RegExp("^[a-zA-Z]{1,25}$")).required();
const comment = Joi.string().pattern(new RegExp("^[a-zA-Z]{3,2000}$")).required();
const image = Joi.string().required();
const star = Joi.number().required();
const type_id = Joi.string().required();
const description = Joi.string().required();
const price = Joi.string().max(25).required();
const quantity = Joi.string().max(25).required();
const ship_fee = Joi.string().max(25).required();
const payment_method = Joi.string().max(25).required();
const timestamp = Joi.string().required();
const out_of_stock = Joi.number().valid(0, 1).required();
const del_flag = Joi.number().valid(0, 1).required();
const date1 = Joi.date().format("YYYY-MM-DD").raw();
const date2 = Joi.date().format("YYYY-MM-DD").raw();

////  Schemas zone //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const schemas = {
  registerAccount: Joi.object().keys({
    role_id: Joi.string().valid("CUS", "SEL").required(),
    name: Joi.string().pattern(new RegExp("^[a-zA-Z]{3,50}$")).required(),
    email: email,
    password: password,
    repeatPassword: Joi.any().valid(Joi.ref("password")),
    timestamp: timestamp,
  }),

  loginAccount: Joi.object().keys({
    email: email,
    password: password,
  }),

  createComment: Joi.object().keys({
    account_id: account_id,
    store_id: store_id,
    product_id: product_id,
    order_id: order_id,
    comment: comment,
    image: image,
    star: star,
    timestamp: timestamp,
  }),

  editComment: Joi.object().keys({
    account_id: account_id,
    product_id: product_id,
    order_id: order_id,
    comment: comment,
    image: image,
    star: star,
    timestamp: timestamp,
  }),

  createProduct: Joi.object().keys({
    store_id: store_id,
    name: name,
    description: description,
    type_id: type_id,
    image: image,
    price: price,
  }),

  editProduct: Joi.object().keys({
    store_id: store_id,
    name: name,
    description: description,
    type_id: type_id,
    image: image,
    price: price,
    out_of_stock: out_of_stock,
    del_flag: del_flag,
  }),

  createOrder: Joi.object().keys({
    account_id: account_id,
    store_id: store_id,
    product_id: product_id,
    quantity: quantity,
    payment_method: payment_method,
    ship_fee: ship_fee,
    price: price,
    timestamp: timestamp,
  }),

  calculate: Joi.object().keys({
    store_id: store_id,
    date1: date1,
    date2: date2,
  }),

  receive: Joi.object().keys({
    order_id: order_id,
    account_id: account_id,
  }),

  createStore: Joi.object().keys({
    owner_id: owner_id,
    name: name,
    address: address,
    description: description,
    type_id: type_id,
    timestamp: timestamp,
  }),

  editStore: Joi.object().keys({
    owner_id: owner_id,
    name: name,
    address: address,
    description: description,
    type_id: type_id,
    timestamp: timestamp,
  }),
};

// const owner_id = req.session.User.id;
// const name = req.body.name;
// const address = req.body.address;
// const description = req.body.description;
// const type_id = req.body.type_id;
// const timestamp = req.body.timestamp;

module.exports = schemas;
