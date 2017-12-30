var mongoose = require('mongoose');

var CompanySchema = mongose.Schema({
	name: String,
	/*position: {

	},
	type: {

	},*/
	criteria: {
		percent_10: Number,
		percent_12: Number,
		cpi: Number,
		backlogs: Number,
		branch: [String],
	},
	position_details: String,
	schedule: String,		//Process
	//attachments: [],
	additional_details: String,

	eligible_students: [String],
	registered_students: [String],
	offered: [String],
	status: {
		type: String,
		default: "Open"
	}
});

var Company = module.exports = mongoose.model('Company', CompanySchema);

module.exports.createCompany = function(newCompany,callback){
	newCompany.save(callback);
}