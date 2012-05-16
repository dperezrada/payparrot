var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var suscriptions_schema = new Schema({
	parrot_id: Schema.ObjectId,
	account_id: Schema.ObjectId,
	active: {type: Boolean, default: false},
	notified: {type: Boolean, default: false},
	first_tweet: {type: Boolean, default: false},
	created_on: Date
});

mongoose.model('Suscriptions', suscriptions_schema);
module.exports = Suscriptions = mongoose.model('Suscriptions');

Suscriptions.prototype.returnJSON = returnJSON;