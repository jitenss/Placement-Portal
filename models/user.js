var mongoose = require('mongoose');
//var bcrypt = require('bcryptjs');
var md5 = require('md5');

//User Schema
var UserSchema = mongoose.Schema({
	email: {
		type: String,
		unique: true
	},
	rollno: {
		type: String
		//unique: true,
		//index: true
	},
	password: {
		type: String
	},
	user_level: {
		type: String,
		default:'student'
	},
	name: String,
	branch: String,
	gender: String,
	date_of_birth: {
		type: Date,
		default: Date.now
	},
	phone_no: {
		phone_no1: Number,
		phone_no2: Number
	},
	spi:{
		spi_1: Number,
		spi_2: Number,
		spi_3: Number,
		spi_4: Number,
		spi_5: Number,
		spi_6: Number,
		spi_7: Number,
		spi_8: Number,
	},
	cpi: Number,
	percent_10: Number,
	percent_12: Number,
	skills: [String],
	application: [String],
	offers: [String],
	level: Number,
	//resume: [],
	status: {
		type: String,
		default: 'registered'					//active,registered,suspended
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser,callback){
	newUser.password = md5(newUser.password);
	console.log(newUser.password);
	newUser.save(callback);
}


module.exports.getUserByEmail = function(email,callback){
	console.log("Finding User By Email");
	var query = {email: email};
	User.findOne(query,callback);
}

module.exports.getUserById = function(id,callback){
	User.findById(id,callback);
}

module.exports.comparePassword = function(password,database_password,callback){
	console.log("Matching Password");
	console.log(password + " " + database_password);
	var isMatch;
	if(password == database_password ){
		isMatch = true;
	}
	else {
		isMatch = false;
	}
	callback(null,isMatch);
}

module.exports.updateUsersPersonalProfile = function(currUser,fullname,gender,dob,mob1,mob2,callback){
	var query = {email: currUser.email};
	var updatedDetails = {name:fullname,
		gender:gender,
		date_of_birth:dob,
		phone_no: {
			phone_no1: mob1,
			phone_no2: mob2
		}};
	User.update(query,updatedDetails,callback);
}
module.exports.updateUsersPasword = function(user_email,newpasshsh,callback){
	var query = {email:user_email};
	var updatedDetails = {password:newpasshsh
		};
	User.update(query,updatedDetails,callback);
}
