const DetailTransactions = require("../Models/detailTransactionModel.js")
const Transactions = require("../Models/transactionModel.js")
const errHandler = require("../Helpers/error_helper.js");
const Products = require("../Models/productModel.js");
const sequelize = require("sequelize")
const { Op } = require("sequelize");

// Create/update DetailTransactions
const upsertDetailTransactions = async (req, res, next) => {
    try {
        let result = await DetailTransactions.upsert(req.body, { where: { id_detailTransaction: req.body.id_detailTransaction } });
        result = JSON.parse(JSON.stringify(result[0]));
        res.app.locals.DetailTransactions = result;
        res.app.locals.msg = "Success! Data has been saved";
    } catch (error) {
        res.app.locals.DetailTransactions = JSON.parse(JSON.stringify(errHandler(error)));
    }
    next();
};

// GET all data DetailTransactions by User
const getDetailTransactionsUser = async (req, res, next) => {
    try {
        let yearMonth = req.query.month
        let year
        let month
        if (yearMonth) {
            if (yearMonth == "all") {
                let result = await Transactions.findAll(
                    {
                        include: [
                            {
                                model: DetailTransactions,
                                include: [{ model: Products }]
                            }
                        ],
                        where: { id_user: req.params.id }
                    }
                );
                if (result == "") {
                    res.app.locals.DetailTransactions = {
                        error: "no detailTransaction exist"
                    };
                } else {
                    result = JSON.parse(JSON.stringify(result));
                    res.app.locals.DetailTransactions = result;
                    return next()
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
        let result = await Transactions.findAll(
            {
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('month', sequelize.col('transactions.createdAt')), month),
                        sequelize.where(sequelize.fn('year', sequelize.col('transactions.createdAt')), year),
                        {id_user: req.params.id}
                    ]
                },
                include: [
                    {
                        model: DetailTransactions,
                        include: [{ model: Products }]
                    }
                ]

            }
        );
        if (result == "") {
            res.app.locals.DetailTransactions = {
                error: "no detailTransaction exist"
            };
        } else {
            result = JSON.parse(JSON.stringify(result));
            res.app.locals.DetailTransactions = result;
        }
    } catch (error) {
        res.app.locals.DetailTransactions = JSON.parse(JSON.stringify(errHandler(error)));
    }
    next();
};
// GET all data DetailTransactions
const getDetailTransactions = async (req, res, next) => {
    try {
        let result = await Transactions.findAll(
            {
                include: [
                    {
                        model: DetailTransactions,
                        include: [{ model: Products }]
                    }
                ]
            }
        );
        if (result == "") {
            res.app.locals.DetailTransactions = {
                error: "no detailTransaction exist"
            };
        } else {
            result = JSON.parse(JSON.stringify(result));
            res.app.locals.DetailTransactions = result;
        }
    } catch (error) {
        res.app.locals.DetailTransactions = JSON.parse(JSON.stringify(errHandler(error)));
    }
    next();
};


// GET all data DetailTransactions based by month
const getDetailTransactionsMonth = async (req, res, next) => {
    try {
        let yearMonth = req.query.month
        let year
        let month
        if (yearMonth) {
            if (yearMonth == "all") {
                let result = await Transactions.findAll(
                    {
                        include: [
                            {
                                model: DetailTransactions,
                                include: [{ model: Products }]
                            }
                        ]
                    }
                );
                if (result == "") {
                    res.app.locals.DetailTransactions = {
                        error: "no detailTransaction exist"
                    };
                } else {
                    result = JSON.parse(JSON.stringify(result));
                    res.app.locals.DetailTransactions = result;
                    return next()
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
        console.log(year)
        console.log(month)
        let result = await Transactions.findAll(
            {
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('month', sequelize.col('transactions.createdAt')), month),
                        sequelize.where(sequelize.fn('year', sequelize.col('transactions.createdAt')), year),

                    ]
                },
                include: [
                    {
                        model: DetailTransactions,
                        include: [{ model: Products }]
                    }
                ]

            }
        );
        if (result == "") {
            res.app.locals.DetailTransactions = {
                error: "no detailTransaction exist"
            };
        } else {
            result = JSON.parse(JSON.stringify(result));
            res.app.locals.DetailTransactions = result;
        }
    } catch (error) {
        res.app.locals.DetailTransactions = JSON.parse(JSON.stringify(errHandler(error)));
    }
    next();
};

//DELETE DetailTransactions
const deleteDetailTransactionsById = async (req, res, next) => {
    try {
        // check if the requested record exist, if exist delete
        const isExist = await DetailTransactions.findOne({ where: { id_detailTransaction: req.params.id } });
        if (isExist) {
            const result = await DetailTransactions.destroy({ where: { id_detailTransaction: req.params.id } });
            if (result) {
                res.app.locals.DetailTransactions = { msg: "data berhasil dihapus" };
                res.app.locals.msg = "Success! Data has been deleted";
            }
        } else {
            res.app.locals.DetailTransactions = { error: "Data tidak ada pada tabel" };
        }
    } catch (error) {
        res.app.locals.DetailTransactions = JSON.parse(JSON.stringify(errHandler(error)));
    }
    next();
};



module.exports = {
    upsertDetailTransactions,
    deleteDetailTransactionsById,
    getDetailTransactions,
    getDetailTransactionsUser,
    getDetailTransactionsMonth
}