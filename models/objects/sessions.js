var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var Sessions_schema = new Schema({
	oauth_token: String,
	oauth_token_secret: String,
	oauth_results: String,
	account_id: Schema.ObjectId,
	external_id: String,
	status: String,
});

mongoose.model('Sessions', Sessions_schema);
var Sessions = mongoose.model('Sessions');
module.exports = Sessions;

Sessions.prototype.returnJSON = returnJSON;