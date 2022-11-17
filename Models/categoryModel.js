const Sequelize = require("sequelize");
const db = require("../Config/Database.js")
const { DataTypes } = Sequelize;

const Categories = db.define(
	"categories",
	{
		id_category: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
		name:{
			type: DataTypes.STRING,
			allowNull: false,
		}
	},
	{
		freezeTableName: true,
	}
);

module.exports = Categories;

(async () => {
	await db.sync();
})();
