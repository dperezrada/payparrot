var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	request = require('request'),
	returnJSON = require('./utils').returnJSON;

var saasy_subscription_schema = new Schema({
 	saasy_subscription_id: String,
	product_path: String,
	account_id: {type: Schema.ObjectId, private: true},
	active: {type: Boolean, default: true, private: true},
	created_at: {type: Date, default: Date.now, private: true},
});

saasy_subscription_schema.method('change_remote_subscription', function(new_plan, callback) {
	var request_url = 'https://Administrator:headjocari@api.fastspring.com/company/payparrot/subscription/'+this.saasy_subscription_id;
	var body = '<subscription><no-end-date/><productPath>/'+new_plan.product_path+'</productPath><quantity>1</quantity><proration>true</proration></subscription>';
	request.put(
		{
			url: request_url,
			body: body,
			'Content-type': 'application/xml'
		},
		function (err, response_put, body) {
			if (err) callback(err);
			else callback(null,body);
		});	
});

saasy_subscription_schema.method('cancel_remote_subscription', function(callback) {
	var request_url = 'https://Administrator:headjocari@api.fastspring.com/company/payparrot/subscription/'+this.saasy_subscription_id;	
	request(
		{
			url: request_url,
			method: 'delete'
		},
		function (err, response_put, body) {
			if (err) callback(err);
			else callback(null);
		});	
});

saasy_subscription_schema.static('cancel_remote_subscription', function(saasy_subscription_id, callback) {
	var request_url = 'https://Administrator:headjocari@api.fastspring.com/company/payparrot/subscription/'+saasy_subscription_id;
	request(
		{
			url: request_url,
			method: 'delete'
		},
		function (err, response_put, body) {
			if (err) callback(err);
			else callback(null);
		});	
});

mongoose.model('SaasySubscriptions', saasy_subscription_schema);
var SaasySubscriptions = mongoose.model('SaasySubscriptions');
module.exports = SaasySubscriptions;


SaasySubscriptions.prototype.returnJSON = returnJSON;
SaasySubscriptions.prototype.returnJSON = returnJSON;
