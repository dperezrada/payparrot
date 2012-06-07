var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var messages_schema = new Schema({
 	text: String,
	url: String,
	id: String,
	account_id: Schema.ObjectId,
	// TODO: CHANGE to boolean
	status: {type: Boolean, private_access: true},
	active: Boolean
});

mongoose.model('Messages', messages_schema);
var Messages = mongoose.model('Messages');
module.exports = Messages;

Messages.prototype.returnJSON = returnJSON;