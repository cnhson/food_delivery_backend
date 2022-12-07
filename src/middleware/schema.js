const Joi = require("joi");

const email = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  })
  .required();

const name = Joi.string()
  .required()
  .min(3)
  .max(255)
  .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/);
const address = name;
const description = name;

const role_id = Joi.string().valid("CUS", "SEL").required();
const owner_id = Joi.string().length(10).required();
const comment_id = Joi.number().min(0).required();

const password = Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()+-/]{8,100}$")).required();
const product_id = Joi.number().min(0).required();
const product_array = Joi.array().min(0).required();
const account_id = Joi.string().length(10).required();

const product_type_id = Joi.string().length(10).required();
const store_id = Joi.string().length(10).required();
const status_id = Joi.string().required();

const order_id = Joi.string().length(10).required();
const comment = Joi.string().pattern(new RegExp("^[a-zA-Z]{3,2000}$")).required();

const image = Joi.string().alphanum().required();
const star = Joi.number().required();
const type_id = Joi.string().alphanum().required();

const price = Joi.string().min(1).max(25).required();
const quantity = Joi.string().max(25).required();
const ship_fee = Joi.string().max(25).required();

const payment_method = Joi.string().alphanum().required();
const timestamp = Joi.string().required();
const out_of_stock = Joi.number().valid(0, 1).required();

const del_flag = Joi.number().valid(0, 1).required();
const date1 = Joi.date().raw();
const date2 = Joi.date().raw();

////  Schemas zone //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const schemas = {
  registerAccount: Joi.object().keys({
    id: owner_id,
    role_id: role_id,
    name: name,
    email: email,
    password: password,
    repeatPassword: Joi.any().valid(Joi.ref("password")),
    timestamp: timestamp,
  }),

  loginAccount: Joi.object().keys({
    role_id: role_id,
    email: email,
    password: password,
  }),

  createComment: Joi.object().keys({
    account_id: account_id,
    store_id: store_id,
    order_id: order_id,
    comment: comment,
    image: image,
    star: star,
  }),

  editComment: Joi.object().keys({
    comment_id: comment_id,
    comment: comment,
    image: image,
    star: star,
  }),

  createProduct: Joi.object().keys({
    store_id: store_id,
    name: name,
    description: description,
    type_id: product_type_id,
    image: image,
    price: price,
  }),

  createProductType: Joi.object().keys({
    id: product_type_id,
    name: name,
    store_id: store_id,
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
    order_id: order_id,
    account_id: account_id,
    store_id: store_id,
    order_detail: Joi.array().items(
      Joi.object().keys({
        product_id: product_id,
        quantity: quantity,
      })
    ),
    payment_method: payment_method,
    ship_fee: ship_fee,
    price: price,
    timestamp: timestamp,
  }),

  profitPerDay: Joi.object().keys({
    store_id: store_id,
    limit: Joi.number().required(),
  }),

  receive: Joi.object().keys({
    order_id: order_id,
    account_id: account_id,
  }),

  createStore: Joi.object().keys({
    id: store_id,
    owner_id: owner_id,
    name: name,
    address: address,
    description: description,
    image: image,
    type_id: type_id,
    timestamp: timestamp,
  }),

  editStore: Joi.object().keys({
    id: store_id,
    owner_id: owner_id,
    name: name,
    address: address,
    description: description,
    type_id: type_id,
    timestamp: timestamp,
  }),
  userId: Joi.object().keys({
    userId: owner_id,
  }),
  storeId: Joi.object().keys({
    storeId: store_id,
  }),
  product_id: Joi.object().keys({
    product_id: product_id,
  }),
};

module.exports = schemas;
