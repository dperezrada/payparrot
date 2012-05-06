var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var messages_schema = new Schema({
 	text: String,
	url: String,
	id: String,
	account_id: Schema.ObjectId
});

mongoose.model('PosibleParrots', messages_schema);
module.exports = PosibleParrots = mongoose.model('PosibleParrots');

PosibleParrots.prototype.returnJSON = returnJSON;