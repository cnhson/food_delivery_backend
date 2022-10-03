const { sequelize } = require("../utils/common");

sequelize
    .authenticate()
    .then(console.log("Connect database successfully"))
    .catch((err) => {
        console.log(err);
    });
