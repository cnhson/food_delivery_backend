const Joi = require("joi");

const email = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  })
  .required();

const password = Joi.string()
  .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()+-/]{8,100}$"))
  .required();

const schemas = {
  // Schema for register
  registerAccount: Joi.object().keys({
    role_id: Joi.string().valid("CUS", "SEL").required(),
    name: Joi.string().pattern(new RegExp("^[a-zA-Z]{3,50}$")).required(),
    email: email,
    password: password,
    repeatPassword: Joi.any().valid(Joi.ref("password")),
    timestamp: Joi.string().required(),
  }),

  // Schema for login
  loginAccount: Joi.object().keys({
    email: email,
    password: password,
  }),

  // Schema for comment
  Comment: Joi.object().keys({
    id: Joi.number().min(0).required(),
    store_id: Joi.string().pattern(new RegExp("^[a-zA-Z]{1,25}$")).required(),
    order_id: Joi.string().pattern(new RegExp("^[a-zA-Z]{1,25}$")).required(),
    account_id: Joi.number().required(),
    comment: Joi.string().pattern(new RegExp("^[a-zA-Z]{3,2000}$")).required(),
    image: Joi.string().required(),
    star: Joi.number().required(),
    timestamp: Joi.string().required(),
  }),
};

module.exports = { schemas };
