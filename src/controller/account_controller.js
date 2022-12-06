const { insertAccount, getAccountByEmailAndRole, getAccountById } = require("../models/account");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const { getUserStore } = require("../models/store");

module.exports = {
  logoutAccount: async function (req, res) {
    try {
      await req.session.destroy();
      res.status(200).json("Logout successfully!");
    } catch (error) {
      res.status(500).json("Logout Failed!");
    }
  },

  registerAccount: async function (req, res) {
    try {
      const id = req.body.id;
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
            res.status(200).json({ message: "there is an error while register account" });
            return console.log("Cannot encrypt");
          }

          hashedPassword = hash;
          // Insert account into database
          const result = await insertAccount(id, role_id, name, email, hashedPassword, timestamp);

          if (result) {
            res.status(200).json({ message: "Register successfully" });
          } else {
            res.status(500).json({ error: "This email is already exists" });
          }
        });
      });
    } catch (err) {
      res.status(500).send("Error");
    }
  },

  loginAccount: async function (req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const role_id = req.body.role_id;

      // Check if given account is exists
      let account = await getAccountByEmailAndRole(email, role_id);
      if (account === null) {
        res.status(500).json({ error: "This account does not exists" });
        return;
      }
      account = account[0];
      //console.log(account[0].password);
      const hashedPassword = account.password;
      bcrypt.compare(password, hashedPassword, async function (err, isMatch) {
        if (err) {
          res.status(200).json({ error: err });
          return;
        }

        if (!isMatch) {
          res.status(200).json({ error: "Password is incorrect" });
          return;
        }
        // get store id
        const store = await getUserStore(account.id);

        res.status(200).json({ message: "Login successfully!", userId: account.id, storeId: store[0].id });
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  getAccount: async function (req, res) {
    try {
      const userId = req.params.userId;

      const data = await getAccountById(userId);
      res.status(200).json(data[0]);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
};
