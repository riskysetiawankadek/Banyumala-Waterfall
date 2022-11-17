const express = require('express');
const router = express.Router();
const users = require('../Controller/userController.js')
const Products = require("../Controller/productController.js")
const Cart = require("../Controller/cartController.js")
const Transactions = require("../Controller/transactionController.js")
const DetailTransaction = require("../Controller/detailTransactionController.js")
const auth = require("../Helpers/authentication.js");
const { numberToCurrency } = require('../Helpers/numberToCurrency.js');

/* GET shop page.*/
router.get('/:id', auth.checkAutinticated, auth.checkRoleMember, users.getMemberbyID, Products.getProducts, function (req, res, next) {
    let Products = res.app.locals.Products
    let Members = res.app.locals.Members
    let user = req.user
    console.log(Members)
    res.render('member/member', { title: 'Shop', layout: './member/layout.ejs', Products, Members, user, numberToCurrency });
});

/* GET cart page.*/
router.get('/cart/:id', auth.checkAutinticated, auth.checkRoleMember, users.getMemberbyID, Cart.getCart, function (req, res, next) {
    let Members = res.app.locals.Members
    let Cart = res.app.locals.Cart
    let msg = res.app.locals.msg
    let user = req.user
    console.log(msg);
    console.log("route exist")
    res.render('member/cart', { title: 'Shopping Cart', layout: './member/layout.ejs', Cart, Members, msg, user, numberToCurrency }, (err, html) => {
        res.app.locals.msg = null;
        res.send(html);
    });
});

// insert cart
router.post('/cart/:id', auth.checkAutinticated, auth.checkRoleMember, Cart.upsertCartbyProduct, function (req, res, next) {
    res.locals.msg = res.app.locals.msg;
    res.redirect(301, '/member/' + req.params.id);
});

// Delete cart
router.delete('/delete_cart/:id/:id_cart', auth.checkAutinticated, auth.checkRoleMember, Cart.deleteCartById, function (req, res, next) {
    console.log("going to delete cart")
    res.locals.msg = res.app.locals.msg;
    res.redirect(301, '/member/cart/' + req.body.id_user);
});

// insert Transactions
router.post('/payment/:id', auth.checkAutinticated, auth.checkRoleMember, Transactions.upsertTransactions, Cart.deleteCartByUser, Transactions.uploadFIle, function (req, res, next) {
    res.locals.msg = res.app.locals.msg;

    res.redirect(301, '/member/cart/' + req.params.id);
});

// insert Transactions
router.post('/cancel-order/:id', auth.checkAutinticated, auth.checkRoleMember, Transactions.memberCancelTransaction, function (req, res, next) {
    res.locals.msg = res.app.locals.msg;
    console.log("--------------------")
    res.redirect(301, '/member/history/' + req.params.id);
});

/* GET history page. */
router.get('/history/:id', auth.checkAutinticated, auth.checkRoleMember, DetailTransaction.getDetailTransactionsUser, Transactions.getTransactions, function (req, res, next) {
    let detailTransaction = res.app.locals.DetailTransactions
    let msg = res.app.locals.msg
    let user = req.user
    let month = req.query.month
    if (!month) {
        y = new Date().getFullYear()
        m = new Date().getMonth() + 1
        month = y.toString() + "-" + String(m).padStart(2, '0')
    }
    console.log("going to order")
    res.render('member/orderHistory', { title: 'Order History', layout: './member/layout.ejs', Transactions, detailTransaction, msg, user, numberToCurrency, month }, (err, html) => {
        res.app.locals.msg = null;
        res.send(html);
    });
});



module.exports = router;