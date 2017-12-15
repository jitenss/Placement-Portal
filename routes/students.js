var express = require('express');
var router = express.Router();

//Students Dashboard
router.get('/dashboard',function(req,res){
	console.log('dashboard');
	res.render('student_dashboard');
});

module.exports = router;
