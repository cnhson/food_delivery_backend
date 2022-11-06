const { insertAccount, getAccountByEmail } = require("../models/account");
const bcrypt = require("bcryptjs");
const session = require('express-session');

module.exports = {

  test: async function (req, res)  {
    const bemail = req.session.User.email;
    const bpassword = req.session.User.password;
    res.send({bemail, bpassword})
  },

  registerAccount: async function (req, res) {
    try {
      let role_id = "";
      const check = req.cus;
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const timestamp = req.body.timestamp;
      let hashedPassword = "";

      //Get role according to the url
      if (check) {
        role_id = "CUS";
      }
      else
      {
        role_id = "SEL";
      }
      
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
      res.status(500).send("Error");
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
      //console.log(account[0].password);
      const hashedPassword = account[0].password;
      bcrypt.compare(password, hashedPassword, function (err, isMatch) {
        if (err) {
          res.status(200).json({ error: err });
          return;
        }

        if (!isMatch) {
          res.status(200).json({ error: "Password is incorrect" });
          return;
        }
        //Get role from above data
        const role = account[0].role;

        //Create session
        req.session.User = {
          id: account[0].id,
          name: account[0].name,
          email: account[0].email,
          password: account[0].password,
          role: "CUS",
        }

        //Redirect to specific url depending on role after succesful login
        if(role === "CUS")
        {
          req.session.save(() => {
            res.redirect('/menu/products')
          });
          console.log(req.session);
        }
        else {
          req.session.save(() => {
            res.redirect('/menu/products')
          });
          console.log(req.session);
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

};
