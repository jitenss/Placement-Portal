var express = require('express');
var router = express.Router();

//Get Homepage
router.get('/',function(req,res){
	res.render('login_signup',{layout: 'layout_login_signup'});
	console.log('home page started');
});

module.exports = router;