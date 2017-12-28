var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Get Homepage
router.get('/',function(req,res){

	// res.render('login_signup',{layout: 'layout_login_signup'});
	// console.log('home page started');
	if(req.isAuthenticated()){
		res.redirect('/users/dashboard');
	}
	else
	{
		res.render('login_signup',{layout: 'layout_login_signup'});
	 	console.log('home page started');
	}

});

module.exports = router;
