const Transactions = require("../Models/transactionModel.js")
const DetailTransaction = require("../Models/detailTransactionModel.js")
const Products = require("../Models/productModel.js")
const errHandler = require("../Helpers/error_helper.js");
const Users = require("../Models/userModel.js")
const DetailTransactions = require("../Models/detailTransactionModel.js")
const sequelize = require("sequelize")
const { Op, where } = require("sequelize");
// Create/update Transactions
const upsertTransactions = async (req, res, next) => {
	try {

		console.log("==================================")
		let productAmount = JSON.parse(req.body.productAmount)
		let start_date = JSON.parse(req.body.start_date)
		let end_date = JSON.parse(req.body.end_date)
		let productArray = []
		let productStock = []
		let idProduct = Object.keys(productAmount)
		let amount = Object.values(productAmount)
		start_date = Object.values(start_date)
		end_date = Object.values(end_date)
		console.log(productAmount)
		// check if transaction can be made (stock is ready)
		console.log("checking product stock..")
		for (let index = 0; index < idProduct.length; index++) {
			const element = idProduct[index];
			console.log("checking product" + element)
			let ready = await Products.findOne({ where: { id_product: element } })
			console.log(ready);
			if (ready.stock < amount[index]) {
				res.app.locals.msg = "Sorry your order can not be made becauese of insuficient Stock.";
				res.locals.skip = 1
				console.log("order cant be made")
				next();
			}
			productStock.push({
				"id_product": idProduct[index],
				"stock": ready.stock - amount[index],
			})
		}
		if (!res.locals.skip) {
			let result = await Transactions.upsert(req.body, { where: { id_transaction: req.body.id_transaction } });
			result = JSON.parse(JSON.stringify(result[0]));
			res.app.locals.Transactions = result;
			for (let index = 0; index < Object.keys(productAmount).length; index++) {
				productArray.push({
					"id_transaction": res.app.locals.Transactions.id_transaction,
					"id_product": idProduct[index],
					"amount": amount[index],
					"start_date": start_date[index],
					"end_date": end_date[index]
				})
			}
			await Products.bulkCreate(productStock, { updateOnDuplicate: ["stock"] })
			result = await DetailTransactions.bulkCreate(productArray)
			console.log(result)
			res.app.locals.msg = "Success! Transaction has been maded. Pleas wait for admin confirmation";
		}

	} catch (error) {
		res.app.locals.Transactions = JSON.parse(JSON.stringify(errHandler(error)));
	}
	next();
};

// Create/update Transactions
const updateTransaction = async (req, res, next) => {
	try {
		console.log(req.body)
		let result = Transactions.update(req.body, { where: { id_transaction: req.body.id_transaction } })
		result = JSON.parse(JSON.stringify(result[0]));
		res.app.locals.Transactions = result;
		res.app.locals.msg = "Success! Transaction status changed";
	} catch (error) {
		res.app.locals.Transactions = JSON.parse(JSON.stringify(errHandler(error)));
	}
	next();
};

// Create/update Transactions
const memberCancelTransaction = async (req, res, next) => {
	try {
		console.log(req.body)
		//update status transaction
		let result
		result = await Transactions.update(req.body, { where: { id_transaction: req.body.id_transaction } })
		//result = JSON.parse(JSON.stringify(result[0]));
		// return product
		result = await DetailTransaction.findAll({where:{id_transaction:req.body.id_transaction}})
		let detailTransaction=[]
		result.forEach(element => {
			detailTransaction.push(JSON.parse(JSON.stringify(element)))
		});
		detailTransaction.forEach(async element => {
			element.product_returned = element.amount
			await DetailTransactions.update(element, { where: { id_detail: element.id_detail } })
			let product = await Products.findOne({where:{id_product:element.id_product}})
			product = JSON.parse(JSON.stringify(product))
			product.stock += element.product_returned
			await Products.update(product, {where:{id_product:element.id_product}})
		})
		console.log(detailTransaction)
		res.app.locals.msg = "Success! Transaction is canceled";
	} catch (error) {
		res.app.locals.Transactions = JSON.parse(JSON.stringify(errHandler(error)));
	}
	next();
};

// GET all data Transactions
const getTransactions = async (req, res, next) => {
	try {
		let result = await Transactions.findAll(
			{ include: Users },
			{ order: [["id_transaction", 'DESC']] }
		);
		if (result == "") {
			res.app.locals.Transactions = {
				error: "no transaction exist"
			};
		} else {
			result = JSON.parse(JSON.stringify(result));
			//console.log(...result)
			res.app.locals.Transactions = result;
		}

	} catch (error) {
		res.app.locals.Transactions = JSON.parse(JSON.stringify(errHandler(error)));
	}
	next();
};
// GET all data Transactions
const getTransactionsByMonth = async (req, res, next) => {
	try {
		let yearMonth = req.query.month
		let year
		let month
		if (yearMonth) {
			if (yearMonth == "all") {
				let result = await Transactions.findAll(
					{ include: Users },
					{ order: [["id_transaction", 'DESC']] }
				);
				if (result == "") {
					res.app.locals.Transactions = {
						error: "no transaction exist"
					};
				} else {
					result = JSON.parse(JSON.stringify(result));
					//console.log(...result)
					res.app.locals.Transactions = result;
					return next();
				}
			}
			else {
				yearMonth = yearMonth.split("-");
				year = Number(yearMonth[0])
				month = Number(yearMonth[1])
			}
		}
		else {
			year = new Date().getFullYear()
			month = new Date().getMonth() + 1
		}
		console.log("get ttansaction by month")
		console.log(month)
		let result = await Transactions.findAll(
			{
				where: {
					[Op.and]: [
						sequelize.where(sequelize.fn('month', sequelize.col('transactions.createdAt')), month),
						sequelize.where(sequelize.fn('year', sequelize.col('transactions.createdAt')), year),
					]
				},
				include: Users
			},
			{ order: [["id_transaction", 'DESC']] }
		);

		if (result == "") {
			res.app.locals.Transactions = {
				error: "no detailTransaction exist"
			};
		} else {
			result = JSON.parse(JSON.stringify(result));
			res.app.locals.Transactions = result;
		}
	} catch (error) {
		res.app.locals.Transactions = JSON.parse(JSON.stringify(errHandler(error)));
	}
	next();
};

//DELETE Transactions
const deleteTransactionsById = async (req, res, next) => {
	try {
		// check if the requested record exist, if exist delete
		const isExist = await Transactions.findOne({ where: { id_transaction: req.params.id } });
		if (isExist) {
			const result = await Transactions.destroy({ where: { id_transaction: req.params.id } });
			if (result) {
				res.app.locals.Transactions = { msg: "data berhasil dihapus" };
				res.app.locals.msg = "Success! Data has been deleted";
			}
		} else {
			res.app.locals.Transactions = { error: "Data tidak ada pada tabel" };
		}
	} catch (error) {
		res.app.locals.Transactions = JSON.parse(JSON.stringify(errHandler(error)));
	}
	next();
};

const uploadFIle = async (req, res, next) => {
	try {
		console.log(req.files)
		console.log(res.locals.skip)
		if(!res.locals.skip){
			if (!req.files) {
				next();
			}
			else {
	
				let transactionImg = req.files.payment;
				let imgFormat = transactionImg.name;
				imgFormat = imgFormat.split(".").pop();
				let imgName = "transaction" + Number(res.app.locals.Transactions.id_transaction) + "." + imgFormat;
				//Use the mv() method to place the file in upload directory (i.e. "uploads")
				console.log("saving...")
				transactionImg.mv('./uploads/' + imgName);
				console.log("saving...")
				console.log(res.app.locals.Transactions);
				await Transactions.update({ payment: imgName }, { where: { id_transaction: res.app.locals.Transactions.id_transaction } })
				res.app.locals.Transactions.payment = imgName;
	
				next()
			}
		}
	} catch (err) {
		res.app.locals.Transactions = JSON.parse(JSON.stringify(errHandler(err)));

	}
}


module.exports = {
	upsertTransactions,
	updateTransaction,
	deleteTransactionsById,
	getTransactions,
	uploadFIle,
	memberCancelTransaction,
	getTransactionsByMonth
}