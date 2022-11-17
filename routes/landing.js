const express = require('express');
const router = express.Router();
const users = require('../Controller/userController.js')
const userModel = require("../Models/userModel.js")
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const Product = require('../Controller/productController.js')
let message;
passport.use(new LocalStrategy(async function verify(username, password, cb) {
    console.log(username)
    let user = await userModel.findOne({ where: { username: username } })
    if (!user) {
        console.log("notfound")
        message = "User not found. Please register"
        return cb(null, false, { message: 'Incorrect username or password.' })
    }
    try {
        if (await bcrypt.compare(password, user.password)) {
            console.log("success")
            return cb(null, user)
        } else {
            console.log("Password incorrect")
            message = "password incorrect"
            return cb(null, false, { message: 'Password incorrect' })
        }
    } catch (e) {
        return cb(e)
    }
}));

passport.serializeUser(function (user, cb) {
    process.nextTick(function() {
        cb(null, { id_user: user.id_user, username: user.username, id_role:user.id_role });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function() {
        return cb(null, user);
      });
});




/* GET landing page. if going to admin-lte, delete index.html*/
router.get('/', Product.getProducts, function (req, res, next) {
    let Product = res.app.locals.Products
    console.log(Product)
    res.render('landing', { title: 'Home', layout: false , Product});
});

/* GET login page. */
router.get('/login', function (req, res, next) {
    let messages = {
        error: message
    }
    res.render('login', { title: 'Home', layout: false, messages }, (err, html) => {
        res.app.locals.msg = null;
        message = null;
        res.send(html);
    });
});

// Post login username and password. autheticate user.
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res) {
    console.log(req.user.id_user)
    if (req.user.id_role == 3) {
        res.redirect('/member/' + String(req.user.id_user));
    }
    else if (req.user.id_role == 1) {
        res.redirect('/admin/');
    }
    else if (req.user.id_role == 2) {
        res.redirect('/bumdes/');
    }

});


/* GET Register page. */
router.get('/register', function (req, res, next) {
    let messages = res.app.locals.msg
    res.render('register', { title: 'Home', layout: false, messages }, (err, html) => {
        res.app.locals.msg = null;
        res.send(html);
    });
});

/* Post Register. create new member*/
router.post('/register', users.createMembers, users.uploadFIle, function (req, res, next) {

    let messages = res.app.locals.msg

    if (res.app.locals.Users) {
        res.app.locals.msg = null;
        res.redirect('login');
    } else {
        res.render('register', { title: 'Home', layout: false, messages }, (err, html) => {
            res.app.locals.msg = null;
            res.send(html);
        });
    }
});

router.delete('/logout', function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
})


module.exports = router;
