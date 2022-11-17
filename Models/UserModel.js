const Sequelize = require("sequelize");
const db = require("../Config/Database.js")
const { DataTypes } = Sequelize;

const Users = db.define(
	"users",
	{
		id_user: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
		id_role: {
            type: DataTypes.INTEGER,
        },
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Please enter your name",
				},
			},
		},
		address: {
			type: DataTypes.STRING
		},
		phone: {
			type: DataTypes.STRING,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true ,
			validate: {
				notEmpty: {
					msg: "Please enter your username",
				}
			},
			unique: {
				args: true,
				msg: 'Email address already in use!'
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Please enter your password",
				},
			},
		},
		photo: {
			type: DataTypes.TEXT,
		},
		gender: {
			type: DataTypes.STRING(20)
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = Users;

(async () => {
	await db.sync();
})();
