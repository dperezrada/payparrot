var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var Notifications_schema = new Schema({
	account_id: Schema.ObjectId,
	external_id: String,
	parrot_id: String,
	request_url: String,
	response_status: Integer,
	response_headers: String,
	response_body: String,
	status: String
});

mongoose.model('Notifications', Notifications_schema);
module.exports = Notifications = mongoose.model('Notifications');

Notifications.prototype.returnJSON = returnJSON;