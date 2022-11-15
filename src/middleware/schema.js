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
    repeatPassword: Joi.ref("password"),
    timestamp: Joi.string().required(),
  }),

  // Schema for login
  loginAccount: Joi.object().keys({}),
};

module.exports = schemas;
