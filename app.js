if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const createError = require('http-errors');
const methodOverride = require('method-override')
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');

const cookieParser = require('cookie-parser');
const cors = require("cors");
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const path = require('path');
const fileUpload = require('express-fileupload');
const passport = require('passport');

//const jszip = require('jszip/dist/jszip');

const indexRouter = require('./routes/landing.js');
const bumdesRouter = require('./routes/bumdes.js');
const adminRouter = require('./routes/admin.js');
const memberRouter = require('./routes/member.js');
const imageRouter = require('./uploads/img.js');

const app = express();
app.use(methodOverride('_method'))


// set view folder to ./views
app.set('views', path.join(__dirname, 'views'));
// set view engine to ejs
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}));
app.use(expressLayouts);
app.use(cors());
// enable files upload
app.use(fileUpload({
    createParentPath: true,

}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash())
app.use(session({
	secret: "@banyumala123_",
	resave: false,
	saveUninitialized: false,
	
}))
app.use(passport.authenticate('session'));
//app.use(express.static('./node_modules/admin-lte')) 

app.use('/', indexRouter);
app.use('/admin',adminRouter);
app.use('/member',memberRouter);
app.use('/bumdes',bumdesRouter);
app.use('/admin/img', imageRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error',{layout: false});
});

// run server
app.listen(process.env.PORT, () =>
	console.log("Server running and listening on port " + process.env.PORT + "!")
);
