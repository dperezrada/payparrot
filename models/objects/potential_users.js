var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var PotentialUsers_schema = new Schema({
	name: String,
	email: String
});

mongoose.model('PotentialUsers', PotentialUsers_schema);
module.exports = PotentialUsers = mongoose.model('PotentialUsers');
