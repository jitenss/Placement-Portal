var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//Student Schema
var StudentSchema = mongoose.Schema({
	//_id: Schema.ObjectId,
	rollno: {
		type: String,
		unique: true,
		index: true
	},
	email: {
		type: String,
		unique: true
	},
	password: {
		type: String
	},
	/*name: String,
	branch: String,
	gender: String,
	date_of_birth: {
		type: Date,
		default: Date.now
	},
	phone_no: [{
		phone_no1: Number,
		phone_no2: Number
	}],
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
		default: registered						//active,registered,suspended
	},
	{discriminatorKey: 'user_type'}*/
});

var Student = module.exports = mongoose.model('Student', StudentSchema);

module.exports.createStudent = function(newStudent,callback){
	bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash("newStudent.passowrd", salt, function(err, hash) {
        	newStudent.passowrd = hash;
        	newStudent.save(callback);
    	});
	});
}


module.exports.getStudentByRollno = function(rollno,callback){
	var query = {rollno: rollno};
	Student.find(query,callback);
}

module.exports.getStudentById = function(id,callback){
	Student.findById(id,callback);
}

module.exports.comparePassword = function(password,hash,callback){
	bcrypt.compare(password, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null,isMatch);
	});
}