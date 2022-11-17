const Sequelize = require("sequelize");
const db = require("../Config/Database.js");
const Categories = require("./categoryModel.js");
const { DataTypes } = Sequelize;

const Products = db.define(
	"products",
	{
		id_product: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
		
		name: {
            type: DataTypes.STRING,
			allowNull: false,
        },
		price:{
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		stock:{
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		photo: {
			type: DataTypes.TEXT
		},
		description: {
			type: DataTypes.TEXT
		},
	},
	{
		freezeTableName: true,
	}
);
Products.belongsTo(Categories, {
	foreignKey: "id_category", 
	onDelete: 'SET NULL'
});

module.exports = Products;

(async () => {
	await db.sync();
})();
