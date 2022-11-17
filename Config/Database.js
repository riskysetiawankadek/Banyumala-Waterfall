const Sequelize = require("sequelize");
const dotenv = require("dotenv")

dotenv.config({ path: './.env' });

const db = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD,{
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    port: process.env.DATABASE_PORT
});

module.exports = db;