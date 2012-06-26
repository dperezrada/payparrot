var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var saasy_subscription_schema = new Schema({
 	saasy_subscription_id: String,
	product_path: String,
	account_id: {type: Schema.ObjectId, private: true},
	active: {type: Boolean, default: true, private: true},
	created_at: {type: Date, default: Date.now, private: true},
});

mongoose.model('SaasySubscriptions', saasy_subscription_schema);
var SaasySubscriptions = mongoose.model('SaasySubscriptions');
module.exports = SaasySubscriptions;


SaasySubscriptions.prototype.returnJSON = returnJSON;
SaasySubscriptions.prototype.returnJSON = returnJSON;
