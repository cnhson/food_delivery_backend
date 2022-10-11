const { getAllAccount } = require("../models/account");

module.exports = {
  getAllAccount: async function (req, res) {
    try {
      const data = await getAllAccount();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
