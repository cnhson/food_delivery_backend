const { insertAccount, getAccountByEmail } = require("../models/account");
const bcrypt = require("bcryptjs");

module.exports = {
  registerAccount: async function (req, res) {
    try {
      const role_id = req.body.role_id;
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const timestamp = req.body.timestamp;
      let hashedPassword = "";

      // Hash password
      bcrypt.genSalt(10, function (err, Salt) {
        bcrypt.hash(password, Salt, async function (err, hash) {
          if (err) {
            res
              .status(200)
              .json({ message: "there is an error while register account" });
            return console.log("Cannot encrypt");
          }

          hashedPassword = hash;
          // Insert account into database
          const result = await insertAccount(
            role_id,
            name,
            email,
            hashedPassword,
            timestamp
          );

          if (result) {
            res.status(200).json({ message: "Register successfully" });
          } else {
            res.status(200).json({ error: "This email is already exists" });
          }
        });
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  loginAccount: async function (req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      // Check if given account is exists
      let account = await getAccountByEmail(email);
      if (account === null) {
        res.status(200).json({ error: "This account does not exists" });
        return;
      }
      account = account.dataValues;
      const hashedPassword = account.password;
      bcrypt.compare(password, hashedPassword, function (err, isMatch) {
        if (err) {
          res.status(200).json({ error: err });
          return;
        }

        if (!isMatch) {
          res.status(200).json({ error: "Password is incorrect" });
          return;
        }

        res.status(200).json({ message: "Login successfully" });
        console.log("successfully");
        return;
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
};
