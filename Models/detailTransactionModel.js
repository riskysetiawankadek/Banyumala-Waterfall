const Sequelize = require("sequelize");
const db = require("../Config/Database.js");
const Transactions = require("../Models/transactionModel.js");
const Products = require("../Models/productModel.js");
const { DataTypes } = Sequelize;

const DetailTransaction = db.define(
	"detail_transaction",
	{
		id_detail: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
		amount: {
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
		},
		product_returned:{
			type: DataTypes.INTEGER,
		}
	},
	{
		freezeTableName: true,
	}
);

DetailTransaction.belongsTo(Transactions, {
	foreignKey: "id_transaction", 
	onDelete: 'SET NULL'
});
DetailTransaction.belongsTo(Products, {
	foreignKey: "id_product", 
	onDelete: 'SET NULL'
});
Transactions.hasMany(DetailTransaction, {
	foreignKey: "id_transaction", 
});
Products.hasMany(DetailTransaction, {
	foreignKey: "id_product", 
});


module.exports = DetailTransaction;

(async () => {
	await db.sync();
})();
