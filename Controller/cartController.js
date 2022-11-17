const Cart = require("../Models/cartModel.js")
const errHandler = require("../Helpers/error_helper.js")
const Product = require("../Models/productModel.js")
const User = require("../Models/UserModel.js")


// Create/update Cart
const upsertCartbyProduct = async (req, res, next) => {
    try {
        req.body.id_user = req.params.id
        console.log(req.body)
        let result
        let isExist = await Cart.findOne({ where: { id_product: req.body.id_product, id_user: req.body.id_user } })
        if (isExist) {
            existingData = JSON.parse(JSON.stringify(isExist))
            existingData.amount += Number(req.body.amount)
            existingData.start_date = req.body.start_date
            existingData.end_date = req.body.end_date
            console.log(existingData);
            result = await Cart.update(existingData, { where: { id_product: req.body.id_product, id_user: req.body.id_user } });
        } else {
            console.log("isnert")
            result = await Cart.create(req.body);
        }
        result = JSON.parse(JSON.stringify(result[0]));
        res.app.locals.Cart = result;
        res.app.locals.msg = "Success! Data has been saved";
    } catch (error) {
        res.app.locals.Cart = JSON.parse(JSON.stringify(errHandler(error)));
    }
    next();
};



// GET all data Cart
const getCart = async (req, res, next) => {
    try {
        let result = await User.findAll(
            {
                include: [
                    {
                        model: Cart,
                        where: { id_user: req.params.id },
                        include: [{ model: Product }]
                    }
                ]
            },
            { order: [["id_cart", 'DESC']] }
        );
        if (result == "") {
            res.app.locals.Cart = {
                error: "no cart exist"
            };
        } else {
            result = JSON.parse(JSON.stringify(result));
            res.app.locals.Cart = result;

        }

    } catch (error) {
        res.app.locals.Cart = JSON.parse(JSON.stringify(errHandler(error)));
    }
    next();
};

//DELETE Cart
const deleteCartById = async (req, res, next) => {
    try {
        console.log("========================")
        // check if the requested record exist, if exist delete
        const isExist = await Cart.findOne({ where: { id_cart: req.params.id_cart } });
        if (isExist) {
            const result = await Cart.destroy({ where: { id_cart: req.params.id_cart } });
            if (result) {
                res.app.locals.Cart = { msg: "data berhasil dihapus" };
                res.app.locals.msg = "Success! Data has been deleted";
            }
        } else {
            res.app.locals.Cart = { error: "Data tidak ada pada tabel" };
        }
    } catch (error) {
        res.app.locals.Cart = JSON.parse(JSON.stringify(errHandler(error)));
    }

    next();
};

//DELETE Cart
const deleteCartByUser = async (req, res, next) => {
    try {
        if (!res.locals.skip) {
            // check if the requested record exist, if exist delete
            const isExist = await Cart.findOne({ where: { id_user: req.params.id } });
            if (isExist) {
                const result = await Cart.destroy({ where: { id_user: req.params.id } });
                if (result) {
                    res.app.locals.Cart = { msg: "data berhasil dihapus" };
                }
            } else {
                res.app.locals.Cart = { error: "Data tidak ada pada tabel" };
            }
        }
    } catch (error) {
        res.app.locals.Cart = JSON.parse(JSON.stringify(errHandler(error)));
    }

    next();
};

module.exports = {
    deleteCartById,
    getCart,
    upsertCartbyProduct,
    deleteCartByUser
}