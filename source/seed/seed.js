
const { Sequelize, DataTypes } = require('sequelize');
require("dotenv").config();
var randomstring = require("randomstring");

var sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: "mysql",
    }
);


var admin = require('../models/admin')(sequelize, DataTypes);

sequelize.sync({ force: true }).then((st) =>{
    admin.create({
        username: randomstring.generate(15),
        name: "Admin",
        email: "admin@learnpluslive.com",
        password: "Admin@123",
        user_type: 0
    }).then((str) => {
        console.log("seeding done");
        process.exit();
    }).catch((err) => {
        console.log(err);
        process.exit();
    })
}).catch((err) => {
    console.log(err);
    process.exit();
});


