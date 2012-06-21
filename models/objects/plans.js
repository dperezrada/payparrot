var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var plans_schema = new Schema({
 	name: String,
	price: String,
	parrots: Number,
	active: {type: Boolean, default: true},
});

mongoose.model('Plans', plans_schema);
var Messages = mongoose.model('Plans');
module.exports = Messages;

Messages.prototype.returnJSON = returnJSON;