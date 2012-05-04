var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accounts_schema = new Schema({
 	email: String,
 	password: String,
	name: String,	     
	startup: String,
	url: String,
	id: String,
});

mongoose.model('Accounts',accounts_schema);
module.exports = mongoose.model('Accounts');
