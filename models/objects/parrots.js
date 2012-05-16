var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var parrots_schema = new Schema({
	twitter_id: String,
	oauth_token: String,
	oauth_token_secret: String,
	created_at: {type: Date, default: Date.now},
	twitter_info: {},
	payments: [],
	id: String
});

mongoose.model('Parrots', parrots_schema);
module.exports = Parrots = mongoose.model('Parrots');

Parrots.prototype.returnJSON = returnJSON;
