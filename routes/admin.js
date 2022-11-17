const express = require("express");
const router = express.Router();
const categories = require("../Controller/categoryController.js");
const users = require("../Controller/userController.js");
const products = require("../Controller/productController.js");
const transactions = require("../Controller/transactionController.js");
const detailTransaction = require("../Controller/detailTransactionController.js");
const path = require("path");
const auth = require("../Helpers/authentication.js");
const { numberToCurrency } = require("../Helpers/numberToCurrency.js");

/* GET home page. */
router.get("/", auth.checkAutinticated, auth.checkRoleAdmin, categories.getCategories, products.getProducts, detailTransaction.getDetailTransactionsMonth, users.getMembers, function (req, res, next) {
  let Categories = res.app.locals.Categories;
  let detailTransaction = res.app.locals.DetailTransactions;
  let Members = res.app.locals.Members;
  let Products = res.app.locals.Products;
  let ProductSold = {};
  if (!Products.error) {
    Products.forEach((product) => {
      ProductSold[product.name] = 0;
    });
  }

  if (!detailTransaction.error) {
    detailTransaction.forEach((transaction) => {
      transaction.detail_transactions.forEach((detail) => {
        //console.log(detail.product.name)
        console.log(detail.amount);
        if (detail.product) {
          if (ProductSold[detail.product.name]) {
            ProductSold[detail.product.name] += detail.amount;
          } else {
            ProductSold[detail.product.name] = detail.amount;
          }
        }
      });
    });
  }
  console.log(detailTransaction);
  let month = req.query.month;
  if (!month) {
    y = new Date().getFullYear();
    m = new Date().getMonth() + 1;
    month = y.toString() + "-" + String(m).padStart(2, "0");
  }
  console.log(month);
  ProductSold = JSON.stringify(ProductSold);
  res.render("admin/dashboard", { title: "Dashboard", layout: "./admin/layout.ejs", Categories, ProductSold, detailTransaction, Members, numberToCurrency, month });
});

/* GET members page. */
router.get("/members", auth.checkAutinticated, auth.checkRoleAdmin, users.getMembers, function (req, res, next) {
  let Members = res.app.locals.Members;
  let msg = res.app.locals.msg;
  console.log(Members);
  res.render("admin/members", { title: "Members", layout: "./admin/layout.ejs", Members, msg, numberToCurrency }, (err, html) => {
    res.app.locals.msg = null;
    res.send(html);
  });
});

// Create members
router.post("/members", auth.checkAutinticated, auth.checkRoleAdmin, users.upsertMembers, function (req, res, next) {
  res.locals.msg = res.app.locals.msg;
  res.redirect(301, "/admin/members");
});

// Delete member
router.delete("/members/:id", users.deleteUsersById, function (req, res, next) {
  res.redirect(301, "/admin/members");
});

/* GET transaction page. */
router.get("/transactions", auth.checkAutinticated, auth.checkRoleAdmin, detailTransaction.getDetailTransactionsMonth, transactions.getTransactionsByMonth, function (req, res, next) {
  let Transactions = res.app.locals.Transactions;
  let detailTransaction = res.app.locals.DetailTransactions;
  let msg = res.app.locals.msg;
  let month = req.query.month;
  if (!month) {
    y = new Date().getFullYear();
    m = new Date().getMonth() + 1;
    month = y.toString() + "-" + String(m).padStart(2, "0");
  }
  console.log(month);
  res.render("admin/transactions", { title: "Transactions", layout: "./admin/layout.ejs", Transactions, detailTransaction, msg, numberToCurrency, month }, (err, html) => {
    res.app.locals.msg = null;
    res.send(html);
  });
});

// Delete transaction
router.delete("/transactions/:id", auth.checkAutinticated, auth.checkRoleAdmin, transactions.deleteTransactionsById, function (req, res, next) {
  res.redirect(301, "/admin/transactions");
});

// Create transaction
router.post("/transactions", transactions.updateTransaction, async function (req, res, next) {
  res.locals.msg = res.app.locals.msg;
  res.redirect(301, "/admin/transactions");
});

/* GET categories page. */
router.get("/categories", auth.checkAutinticated, auth.checkRoleAdmin, categories.getCategories, function (req, res, next) {
  let Categories = res.app.locals.Categories;
  let msg = res.app.locals.msg;
  res.render("admin/categories", { title: "Categories", layout: "./admin/layout.ejs", Categories, msg, numberToCurrency }, (err, html) => {
    res.app.locals.msg = null;
    res.send(html);
  });
});

// Create categories
router.post("/categories", auth.checkAutinticated, auth.checkRoleAdmin, categories.upsertCategories, function (req, res, next) {
  console.log(res.app.locals.Categories);
  res.locals.msg = res.app.locals.msg;
  console.log(res.locals.msg);
  res.redirect(301, "/admin/categories");
});

// Delete categories
router.delete("/categories/:id", auth.checkAutinticated, auth.checkRoleAdmin, categories.deleteCategoriesById, function (req, res, next) {
  console.log(res.app.locals.Categories);
  res.redirect(301, "/admin/categories");
});

/* GET products page. */
router.get("/products", auth.checkAutinticated, auth.checkRoleAdmin, categories.getCategories, products.getProducts, function (req, res, next) {
  let Products = res.app.locals.Products;
  let Categories = res.app.locals.Categories;
  let msg = res.app.locals.msg;
  res.render("admin/products", { title: "Products", layout: "./admin/layout.ejs", Products, Categories, msg, numberToCurrency }, (err, html) => {
    res.app.locals.msg = null;
    res.send(html);
  });
});

// Create product
router.post("/products", auth.checkAutinticated, auth.checkRoleAdmin, products.upsertProducts, products.uploadFIle, async function (req, res, next) {
  console.log(res.app.locals.Products);
  res.locals.msg = res.app.locals.msg;
  console.log(res.locals.msg);
  res.redirect(301, "/admin/products");
});

// Delete products
router.delete("/products/:id", auth.checkAutinticated, auth.checkRoleAdmin, products.deleteProductsById, function (req, res, next) {
  res.redirect(301, "/admin/products");
});

// update stock product
router.post("/updatestock", auth.checkAutinticated, auth.checkRoleAdmin, products.updateStock, async function (req, res, next) {
  console.log(res.app.locals.Products);
  res.locals.msg = res.app.locals.msg;
  console.log(res.locals.msg);
  res.redirect(301, "/admin/transactions?month=all");
});

module.exports = router;
