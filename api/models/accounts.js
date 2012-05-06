var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	crypto = require('crypto'),
	returnJSON = require('./utils').returnJSON;

var accounts_schema = new Schema({
 	email: String,
 	password: {type: String, private: true},
	name: String,	     
	startup: String,
	url: String,
	id: String,
	credentials: {type: Schema.Types.Mixed, private: true}
});
// TODO: Check problem with redefine
accounts_schema.pre('save', function(next){
	var current_date = (new Date()).valueOf().toString();
	var random = Math.random().toString();
	
	this.credentials = {'public_token': crypto.createHash('sha1').update(current_date + random).digest('hex')};
	next();
});

mongoose.model('Accounts', accounts_schema);
module.exports = Accounts = mongoose.model('Accounts');

Accounts.prototype.returnJSON = returnJSON;