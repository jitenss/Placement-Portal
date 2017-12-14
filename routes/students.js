var express = require('express');
var router = express.Router();

router.post('/register',function(req,res){
	var rollNo = req.body.rollno;
	var email = req.body.email;
	var password = req.body.password;
	var confirm_password = req.body.confirm_password;

	console.log(rollNo);
});

module.exports = router;
