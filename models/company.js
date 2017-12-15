var mongoose = require('mongoose');

var CompanySchema = mongose.Schema({
	_id: Schema.ObjectId,
	name: String,
	position: {

	},
	branch: [String],
	criteria: {
		percent_10: Number,
		percent_12: Number,
		cpi: Number
	},
	process: {

	},
	type: {

	},
	attachments: [],
	schedule: {},
	additional_details: String,

	eligible_students: {},
	registered_students: {},
	offered: {},
	status: {}
});

var Company = module.exports = mongoose.model('Company', CompanySchema);