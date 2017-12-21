var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var md5 = require('md5');
//var bcrypt = require('bcrypt')
var User = require('../models/user');

//Check authentication
function ensureAuthenticated(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else
	{
		req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}

//Register user
router.post('/register',function(req,res){
	var name = req.body.name;
	var rollno = req.body.rollno;
	var email = req.body.email;
	var password = req.body.password;
	var confirm_password = req.body.confirm_password;
	//var user_level = req.body.user_level;

	//Validation
	req.checkBody('name','Name is required').notEmpty();
	req.checkBody('rollno','Roll Number is required').notEmpty();
	req.checkBody('email','Email is required').notEmpty();
	req.checkBody('email','Email is not valid').isEmail();
	req.checkBody('password','Password is required').notEmpty();
	req.checkBody('confirm_password','Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		req.flash('error',errors);
		res.redirect('/');

		console.log(errors);
	}
	else{
		User.getUserByEmail(email, function(err, user){
			if(err) throw err;
			if(user){
				console.log(user);
				console.log("user already Exist");
				req.flash('error_msg', 'The Email Id is already registered');
				res.redirect('/');
			}
			else {
				var newUser = new User({
					name: name,
					rollno: rollno,
					email: email,
					password: password
				});

				User.createUser(newUser,function(err,user){
					if(err) throw err;
					console.log(user);
				});
				console.log('registered');
				req.flash('success_msg','Registration Successfull: Now you can login to your account');
				res.redirect('/');
			}
		});
	}
});

//login using local-strategy
passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
  function(username, password, done) {
	User.getUserByEmail(username,function(err,user){
		if(err) throw err;

		// var entered_password = md5(password);
		if(!user) {
			console.log("User Not Found !");
			return done(null,false,{message: 'Unknown user'})
		}
		else{
			console.log("User Found :)");
			console.log(user.password);
			if(User.comparePassword(md5(password),user.password,function(err,isMatch){
				if(err) throw err;
				console.log(isMatch);
				if(!isMatch){
					console.log("Password Not Match :(");
					return done(null,false,{message: 'Invalid Password'});
				}
				else{
					console.log("Logged In :)");
					return done(null,user);
				}
			}));

		}
	});
	}
));

//Serialization
passport.serializeUser(function(user, done) {
	console.log(user);
  done(null, user.id);
});

//Deserialization
passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

//logout
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/');
});

//login
router.post('/login',
  passport.authenticate('local',{session:true, faliureRedirect: '/', failureFlash:true}),
  function(req, res) {
			res.redirect('/users/dashboard');
});

//peronal Profile
router.get('/personal',ensureAuthenticated, function(req, res){
	console.log("On personal Profile");
	res.render('studentPersonalProfile');
});

//Submit Personal Profile
router.post('/submit_personal',ensureAuthenticated,function(req,res){
	var fullname = req.body.fullname;
	var gender = req.body.gender;
	var dob = req.body.dob;
	var mob1 = req.body.mob1;
	var mob2 = req.body.mob2;

	var currUser = req.user;

	User.updateUsersPersonalProfile(currUser,fullname,gender,dob,mob1,mob2,function(err,user){
		if(err) throw err;
		console.log(req.user);

		req.flash('success_msg', 'Profile Updated');
		res.redirect('/users/personal');
	});
})

//Academic Profile
router.get('/academic',ensureAuthenticated, function(req, res){
	console.log("On Academic Profile");
	res.render('studentAcademicProfile');
});

//Submit academic profile
/*router.post('/submit_personal',ensureAuthenticated, function(req,res){
	var branch = req.body.branch;
	var precent_10 = req.body.precent_10;
	var precent_12 = req.body.precent_12;
	var spi_1 = req.body.spi_1;
	var spi_2 = req.body.spi_2;
	var spi_3 = req.body.spi_3;
	var spi_4 = req.body.spi_4;
	var spi_5 = req.body.spi_5;
	var spi_6 = req.body.spi_6;
	var spi_7 = req.body.spi_7;
	var spi_8 = req.body.spi_8;
	var cpi = req.body.cpi;
	var skills = req.body.skills;
	var
});*/

//About US Profile
router.get('/aboutUs', function(req, res){
	console.log("On About Us Page");
	res.render('aboutUs');
});

//opportunities for me Profile
router.get('/opportunitiesForMe', function(req, res){
	console.log("On opportunities For Me");
	res.render('opportunitiesForMe');
});

//opportunities for all Profile
router.get('/opportunitiesForAll', function(req, res){
	console.log("On opportunities For All");
	res.render('opportunitiesForall');
});

//opportunities for all Profile
router.get('/applications', function(req, res){
	console.log("On Aplications page");
	res.render('applications');
});
//opportunities for all Profile
router.get('/offers', function(req, res){
	console.log("On Job offers Page");
	res.render('offers');
});
//Dashboard
router.get('/dashboard',function(req,res){
	console.log('dashboard');
	if(req.user.user_level=="student"){
		console.log("Logged In As Student");
		res.render('student_dashboard');
	}
	else if(req.user.user_level=="admin"){
		console.log("Logged In As Admin");
		res.render('admin_dashboard', {layout: 'layoutb.handlebars'});
	}
});

module.exports = router;
