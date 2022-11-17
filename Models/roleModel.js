const Sequelize = require("sequelize");
const db = require("../Config/Database.js")
const { DataTypes } = Sequelize;

const Roles = db.define(
	"roles",
	{
		id_role: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
		name: {
            type: DataTypes.INTEGER,
        }
	},
	{
		freezeTableName: true,
	}
);

module.exports = Roles;

(async () => {
	await db.sync();
})();
