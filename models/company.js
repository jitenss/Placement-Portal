var mongoose = require('mongoose');

var CompanySchema = mongoose.Schema({
	name: String,
	/*position: {

	},
	type: {

	},*/
	criteria: {
		percent_10:
		{
			type:Number,
			default:0
		},
		percent_12:
		{
			type:Number,
			default:0
		},
		cpi:
		{
			type:Number,
			default:0
		},
		backlogs:
		{
			type:Number,
			default:0
		},
		branch:
		{
			type:[String],
			default:["CSE","CCE","ECE","MME","ME"]
		}
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
module.exports.getUserByOppurtunity = function(CurrUser,callback){
	Company.find(
	{
	  "criteria.percent_10":{$lte:CurrUser.percent_10_value},
	  "criteria.percent_12":{$lte:CurrUser.percent_12_value},
	  "criteria.cpi":{$lte:CurrUser.cpi},
	  "criteria.backlogs":{$gte:CurrUser.backlogs},
	  "criteria.branch":{$all:[CurrUser.branch]}
	},callback)
}
