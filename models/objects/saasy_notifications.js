var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var saasy_notification_schema = new Schema({
 	saasy_subscription_id: String,
	account_id: {type: Schema.ObjectId, private: true},
	data: {type: Schema.Types.Mixed, private: true},
	created_at: {type: Date, default: Date.now, private: true},
	type: String
});

mongoose.model('SaasyNotifications', saasy_notification_schema);
var SaasyNotifications = mongoose.model('SaasyNotifications');
module.exports = SaasyNotifications;


SaasyNotifications.prototype.returnJSON = returnJSON;
SaasyNotifications.prototype.returnJSON = returnJSON;
