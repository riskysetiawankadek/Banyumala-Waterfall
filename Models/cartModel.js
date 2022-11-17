const Sequelize = require("sequelize");
const db = require("../Config/Database.js")
const { DataTypes } = Sequelize;
const Users = require("./UserModel");
const Products = require("./productModel");

const Cart = db.define(
	"cart",
	{
		id_cart: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
		amount:{
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		start_date:{
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		end_date:{
			type: DataTypes.DATEONLY,
			allowNull: false,
		}	
	},
	{
		freezeTableName: true,
	}
);

Cart.belongsTo(Users, {
	foreignKey: "id_user", 
	onDelete: 'SET NULL'
});
Cart.belongsTo(Products, {
	foreignKey: "id_product", 
	onDelete: 'SET NULL'
});
Users.hasMany(Cart,{
    foreignKey: "id_user", 
})
Products.hasMany(Cart,{
	foreignKey: "id_product", 
})



module.exports = Cart;

(async () => {
	await db.sync();
})();
