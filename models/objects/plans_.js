var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var plans_schema = new Schema({
 	name: String,
	price: String,
	parrots: Number,
	id: String,
	product_url: String,
	product_path: String,
	created_at: {type: Date, default: Date.now, private: true},
});

mongoose.model('Plans', plans_schema);
var Plans = mongoose.model('Plans');
module.exports = Plans;

Plans.prototype.returnJSON = returnJSON;