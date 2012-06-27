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

accounts_plans_schema.method('disable', function(callback) {
	this.active = false;
	this.save(function(err){
		if (err) calback(err);
		else callback(null);
	});
});

mongoose.model('AccountsPlans', accounts_plans_schema);
var AccountsPlans = mongoose.model('AccountsPlans');
module.exports = AccountsPlans;

AccountsPlans.create_from_plan = function(account, new_plan, callback) {
	var plan_data = new_plan.toJSON();
	delete plan_data._id;
	plan_data['active'] = true;
	plan_data['account_id'] = account._id;
	var new_account_plan = new AccountsPlans(plan_data);
	new_account_plan.save(function(err){
		if(err) callback(err);
		else {
			callback(null, new_account_plan);
		}
	});
};


AccountsPlans.prototype.returnJSON = returnJSON;
AccountsPlans.prototype.returnJSON = returnJSON;
