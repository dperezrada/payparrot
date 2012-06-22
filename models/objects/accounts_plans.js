var mongoose = require('mongoose')
	,Schema = mongoose.Schema
	,_ = require('underscore')
	,crypto = require('crypto')
	,returnJSON = require('./utils').returnJSON;

var accounts_plans_schema = new Schema({
 	name: String,
 	price: String,
 	parrots: Number,
 	account_id: Schema.ObjectId,
	id: String,
	active: {type: Boolean, default: false},
	created_at: {type: Date, default: Date.now, private: true},
}, {strict:true});



mongoose.model('AccountsPlans', accounts_plans_schema);
var AccountsPlans = mongoose.model('AccountsPlans');
module.exports = AccountsPlans;

AccountsPlans.prototype.returnJSON = returnJSON;
