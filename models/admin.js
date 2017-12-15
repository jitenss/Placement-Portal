var mongoose = require('mongoose');

//Admin Schema
var AdminSchema = mongoose.Schema({
	_id: Schema.ObjectId,
	email: {
		type: String,
		unique: true
	},
	password: String
});

var Admin = module.exports = mongoose.model('Admin', AdminSchema);