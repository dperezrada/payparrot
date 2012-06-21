var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var accounts_plans_schema = new Schema({
	id: String,
 	name: String,
	price: String,
	account_id: {type: Schema.ObjectId, private: true},
	parrots: Number,
	active: {type: Boolean, default: true, private: true},
	created_at: {type: Date, default: Date.now, private: true},
});

mongoose.model('AccountsPlans', accounts_plans_schema);
var AccountsPlans = mongoose.model('AccountsPlans');
module.exports = AccountsPlans;

AccountsPlans.prototype.returnJSON = returnJSON;