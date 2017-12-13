var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local-roles').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

 mongoose.connect("mongodb://localhost:27017/placement-portal", {
   useMongoClient: true,
 });
 var db = mongoose.connection;

var routes = require('./routes/index');
var students = require('./routes/students');

//init app
var app = express();

//BodyParser Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(cookieParser());

//View engine
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('views', path.join(__dirname, 'views'));

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Passport init
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Connect flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  //res.locals.user = req.user || null;
  next();
});

//Set routes
app.use('/',routes);
app.use('/students',students);

//Set Port
app.set('port',(process.env.PORT || 3000));
app.listen(app.get('port'),function(){
	console.log("Server started on port");
});

