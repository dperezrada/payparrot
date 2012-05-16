var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var Notifications_schema = new Schema({
	account_id: Schema.ObjectId,
	external_id: String,
	parrot_id: String,
	request_url: String,
	// Integer doesn't exists. Needs to be forced as integer? Or just a Number?
	response_status: Number,
	response_headers: String,
	response_body: String,
	status: String,
	type: String,
	created_at: {type: Date, default: Date.now}
});

mongoose.model('Notifications', Notifications_schema);
module.exports = Notifications = mongoose.model('Notifications');

Notifications.prototype.returnJSON = returnJSON;