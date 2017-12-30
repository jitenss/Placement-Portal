var express = require('express');
var path = require('path');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var md5 = require('md5');
//var bcrypt = require('bcrypt')
var helpers = require('handlebars-helpers')();
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var fileUpload = require('express-fileupload');

var User = require('../models/user');
var Company = require('../models/company');
/*-----------------------------------------Common------------------------------------------------*/

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

//Change password
router.get('/ChangePassword',function(req,res){
		res.render('ChangePassword',{layout:'layoutb.handlebars'});
});

//Change Password
router.post('/ChangePasswordFunction',ensureAuthenticated,function(req,res){
	var Curr = req.body.CurrentPassword;
	var newpass = req.body.NewPassword;
	var conpass = req.body.ConfirmPassword;
	var CurrUser= req.user;
	//var user_level = req.body.user_level;
	console.log(Curr);
	console.log(newpass);
	console.log(conpass);
	console.log(CurrUser);
	//Validation
	req.checkBody('Curr','Old Password is required').notEmpty();
	req.checkBody('newpass','New Password is required').notEmpty();
	req.checkBody('conpass','Confirm Password is required').notEmpty();
	req.checkBody('conpass','Passwords do not match').equals(req.body.NewPassword);

	var errors = req.validationErrors();

	if(errors){
		console.log(errors);
		req.flash('error',errors);
		res.redirect('/users/ChangePassword');
	}
	else{
		User.comparePassword(md5(Curr),req.user.password,function(err,isMatch){
			if(err) throw err;
			console.log(isMatch);
			if(!isMatch){
				console.log("Password Not Match :(");
				return done(null,false,{message: 'Invalid Password'});
			}
		});
		User.updateUsersPassword(CurrUser,md5(newpass),function(err,user){
			if(err) throw err;
				console.log(req.user);
				req.flash('success_msg', 'Password Updated');
				res.redirect('/users/ChangePassword');
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

//login
// router.post('/login',
//   passport.authenticate('local',{session:true, faliureRedirect: '/', failureFlash:true}),
//   function(req, res) {
// 			res.redirect('/users/dashboard');
// });
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err)
    if (!user) {
			req.flash('error_msg', 'Invalid Details');
      return res.redirect('/')
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/users/dashboard');
    });
  })(req, res, next);
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

//logout
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/');
});
//forgotPassword
// router.get('/forgot', function(req, res) {
//   res.render('forgot');
// });
// router.get('/forgot', function(req, res, next) {
//   async.waterfall([
//     function(done) {
//       crypto.randomBytes(20, function(err, buf) {
//         var token = buf.toString('hex');
//         done(err, token);
//       });
//     },
//     function(token, done) {
//       User.findOne({ email: req.body.email }, function(err, User) {
//         if (!User) {
//           req.flash('error', 'No account with that email address exists.');
//           return res.redirect('/forgot');
//         }
//
//         User.resetPasswordToken = token;
//         User.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//
//         User.save(function(err) {
//           done(err, token, User);
//         });
//       });
//     },
//     function(token, User, done) {
//       var smtpTransport = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//           user: 'learntocodeinfo@gmail.com',
//           pass: process.env.GMAILPW
//         }
//       });
//       var mailOptions = {
//         to: User.email,
//         from: 'learntocodeinfo@gmail.com',
//         subject: 'Node.js Password Resets',
//         text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//           'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//           'http://' + req.headers.host + '/reset/' + token + '\n\n' +
//           'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//       };
//       smtpTransport.sendMail(mailOptions, function(err) {
//         console.log('mail sent');
//         req.flash('success', 'An e-mail has been sent to ' + User.email + ' with further instructions.');
//         done(err, 'done');
//       });
//     }
//   ], function(err) {
//     if (err) return next(err);
//     res.redirect('/forgot');
//   });
// });
/*------------------------------------------Student-----------------------------------------*/

//Peronal Profile
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

	var updatedDetails = {
		name: fullname,
		gender: gender,
		date_of_birth: dob,
		phone_no: {
			phone_no1: mob1,
			phone_no2: mob2
		},
		register_level: 1
	};

	User.updateUsersPersonalProfile(currUser,updatedDetails,function(err,user){
		if(err) throw err;
		console.log(req.user);

		req.flash('success_msg', 'Personal Profile Updated');
		res.redirect('/users/personal');
	});
})

//Academic Profile
router.get('/academic',ensureAuthenticated, function(req, res){
	console.log("On Academic Profile");
	res.render('studentAcademicProfile');
});

//Submit academic profile
router.post('/submit_academic',ensureAuthenticated, function(req,res){
	var branch = req.body.branch;
	var percent_10_type = req.body.percent_10_type;
	var percent_10_value = req.body.percent_10_value;
	var percent_12_type = req.body.percent_12_type;
	var percent_12_value = req.body.percent_12_value;
	var spi_1 = req.body.spi_1;
	var spi_2 = req.body.spi_2;
	var spi_3 = req.body.spi_3;
	var spi_4 = req.body.spi_4;
	var spi_5 = req.body.spi_5;
	var spi_6 = req.body.spi_6;
	var spi_7 = req.body.spi_7;
	var spi_8 = req.body.spi_8;
	var cpi = req.body.cpi;

	var currUser = req.user;
	var updatedDetails = {
		branch: branch,
		percent_10_type: percent_10_type,
		percent_10_value: percent_10_value,
		percent_12_type: percent_12_type,
		percent_12_value: percent_12_value,
		spi: {
			spi_1: spi_1,
			spi_2: spi_2,
			spi_3: spi_3,
			spi_4: spi_4,
			spi_5: spi_5,
			spi_6: spi_6,
			spi_7: spi_7,
			spi_8: spi_8,
		},
		cpi: cpi,
		register_level: 2
	};
	console.log(updatedDetails);
	User.updateUsersAcademicProfile(currUser,updatedDetails,function(err,user){
		if(err) throw err;
		//console.log(req.user);

		req.flash('success_msg', 'Academic Profile Updated');
		res.redirect('/users/academic');
	});
	//console.log(req.user);
});

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
//Skills for all Profile
router.get('/skills', function(req, res){
	console.log("On Skills Page");
	res.render('skills');
});

router.post('/addSkill', function(req, res){
	var skill = req.body.skill;
	var currUser = req.user;
	var updatedDetails = {
		skills : skill
	}
	console.log("Adding New Skill");
	console.log(skill);
	User.addNewSkill(currUser,updatedDetails,function(err,user){
		if(err) throw err;
		req.flash('success_msg', 'Added succesfully');
		console.log(user);
		res.redirect('/users/skills');
	});
});

router.post('/removeSkill', function(req, res){
	var skill = req.body.skill;
	var currUser = req.user;
	var updatedDetails = {
		skills : skill
	}
	console.log("Removing New Skill");
	console.log(updatedDetails);
	User.removeSkill(currUser,updatedDetails,function(err,user){
		if(err) throw err;
		req.flash('success_msg', 'Remove succesfully');
		console.log(user);
		res.redirect('/users/skills');
	});
});
/*----------------------------------------------Admin------------------------------------------*/

//Placement
router.get('/placements', function(req, res){
	console.log("On placement offers Page");
	User.getUserByLevel('student',function(err, result){
		if(err) throw err;
		console.log(result);
	res.render('placements',{layout:'layoutb.handlebars',result:result});
	});
});

//Create Event
router.get('/createEvent', function(req, res){
	console.log("On Create Event Page");
	User.getUserByLevel('student',function(err, result){
		if(err) throw err;
		console.log(result);
		res.render('createEvent',{layout:'layoutb.handlebars',result:result});
	});
});

//Create Event Submit
router.post('/submit_event',function(req,res){
	// var companyName = req.body.cName;
	// var position = req.body.position;
	// var type = req.body.type;
	// var branch = req.body.branch;
	// var percent_10 = req.body.percent_10;
	// var percent_12 = req.body.percent_12;
	// var cpi = req.body.cpi;
	// var backlogs = req.body.backlogs;
	// var positionDetails = req.body.positiondetails;
	// var schedule = req.body.schedule;
	// var addDetails =req.body.additionaldetails;

	var sampleFile = req.files.companyfile;

	// var newCompany = new Company({
	// 	name: companyName,
	// 	//position:,
	// 	//type:,
	// 	criteria: {
	// 		percent_10: percent_10,
	// 		percent_12: percent_12,
	// 		cpi: cpi,
	// 		backlogs: backlogs,
	// 		branch: branch
	// 	},
	// 	position_details: positionDetails,
	// 	schedule: schedule,
	// 	additional_details: addDetails,
	// 	status: "open"
	// });
	// console.log("Company Object Created");
	// Company.createCompany(newCompany,function(err,result){
	// 	if(err) throw err;
	// 	console.log(result);

	// });

	//if(!req.files)
	//	return res.status(400).send('No files were uploaded.');
	

	// sampleFile.mv(path.join(__dirname,companyfiles)+sampleFile+'.ods', function(err) {
 //    	if (err)
 //  	    return res.status(500).send(err);

 //    	res.send('File uploaded!');
	// });
	req.flash('success_msg','Company added succesfully');
	res.redirect('/users/dashboard');
});

//Students
router.get('/Students', function(req, res){
	console.log("On Students page");
	User.getUserByLevel('student',function(err, result){
		if(err) throw err;
		console.log(result);
	res.render('Students',{layout:'layoutb.handlebars',result:result});
	});
});

//jobOffers
router.get('/JobOffers', function(req, res){
	console.log("On JobOffers page");
	User.getUserByLevel('student',function(err, result){
		if(err) throw err;
		console.log(result);
	res.render('JobOffers',{layout:'layoutb.handlebars',result:result});
	});
});

//InternshipOffers
router.get('/internOffers', function(req, res){
	console.log("On internOffers page");
	User.getUserByLevel('student',function(err, result){
		if(err) throw err;
		console.log(result);
	res.render('InternshipOffers',{layout:'layoutb.handlebars',result:result});
	});
});

//Categories
router.get('/categories', function(req, res){
	console.log("On Categories Page Page");
	res.render('categories', {layout:'layoutb.handlebars'});
});

module.exports = router;
