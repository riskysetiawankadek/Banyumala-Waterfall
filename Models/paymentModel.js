const Sequelize = require("sequelize");
const db = require("../Config/Database.js")
const { DataTypes } = Sequelize;

const Payment = db.define(
	"payment",
	{
		id_payment: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
		id_transaction: {
            type: DataTypes.INTEGER,
			allowNull: false,
        },
		total_payment: {
            type: DataTypes.INTEGER,
			allowNull: false,
        },
		payment_type:{
			type: DataTypes.STRING,
			allowNull: false,
		},
		pdf: {
			type: DataTypes.TEXT
		},
		payment_data: {
			type: DataTypes.TEXT
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = Payment;

(async () => {
	await db.sync();
})();
