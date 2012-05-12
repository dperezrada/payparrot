var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var Notifications_schema = new Schema({
	oauth_token: String,
	oauth_token_secret: String,
	oauth_results: String,
	account_id: Schema.ObjectId,
	external_id: String,
	status: String,
});

mongoose.model('Notifications', Notifications_schema);
module.exports = Notifications = mongoose.model('Notifications');

Notifications.prototype.returnJSON = returnJSON;