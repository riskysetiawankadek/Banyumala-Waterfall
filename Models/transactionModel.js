const Sequelize = require("sequelize");
const db = require("../Config/Database.js")
const { DataTypes } = Sequelize;
const Users = require("../Models/userModel.js");


const Transactions = db.define(
	"transactions",
	{
		id_transaction: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
		total: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Please enter your transaction amount",
				},
			},
		},
		status: {
			type: DataTypes.STRING
		},
		payment: {
			type: DataTypes.STRING
		}
	},
	{
		freezeTableName: true,
	}
);

Transactions.belongsTo(Users, {
	foreignKey: "id_user", 
	onDelete: 'SET NULL'
});

module.exports = Transactions;

(async () => {
	await db.sync();
})();
