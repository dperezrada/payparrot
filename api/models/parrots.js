var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var parrots_schema = new Schema({
	active: {type: Boolean, default: false},
	notified: {type: Boolean, default: false},
	first_tweet: {type: Boolean, default: false},
	account_id: String,
	oauth_token: String,
	oauth_token_secret: String,
	oauth_results: String,
	account_id: Schema.ObjectId,
	twitter_info: {}
});

mongoose.model('Parrots', parrots_schema);
module.exports = Parrots = mongoose.model('Parrots');

Parrots.prototype.returnJSON = returnJSON;