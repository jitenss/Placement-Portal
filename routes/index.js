var express = require('express');
var router = express.Router();
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;

var Student = require('../models/student');

//Get Homepage
router.get('/',function(req,res){
	res.render('login_signup');
	console.log('home page started');
});

//Register
/*router.post('/register',function(req,res){
	var rollno = req.body.rollno;
	var email = req.body.email;
	var password = req.body.password;
	var confirm_password = req.body.confirm_password;

	//Validation
	req.checkBody('rollno','Roll Number is required').notEmpty();
	req.checkBody('email','Email is required').notEmpty();
	req.checkBody('email','Email is not valid').isEmail();
	req.checkBody('password','Password is required').notEmpty();
	//req.checkBody('rollno','Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('login_signup',{
			errors: errors
		});
		console.log(errors);
	}
	else{
		console.log('passed');

		var newStudent = new Student({
			rollno: rollno,
			email: email,
			password: password
		});

		Student.createStudent(newStudent,function(err,student){
			if(err) throw err;
			console.log(student);
		});

		res.redirect('/'); 
	}
});*/

//login
/*passport.use(new LocalStrategy(
  function(username, password, done) {
	Student.getStudentByRollno(rollno,function(err,student){
		if(err) throw err;
		if(!student) {
			return done(null,false,{message: 'Unknown user'})
		}
		Student.comparePassword(password,student.password,function(){
			if(err) throw err;
			if(isMatch){
				return done(null,student);
			}
			else{
				return done(null,false,{message: 'Invalid Password'});
			}
		});
	});    
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getStudentById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local',{successRedirect: '/students/dashboard', faliureRedirect: '/', failureFlash:true}),
  function(req, res) {
		res.redirect('/students/dashboard');    
});*/

module.exports = router;