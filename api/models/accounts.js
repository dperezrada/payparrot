// Refactorizar
var mongoose = require('mongoose');
var generate_mongo_url = require('../libs/mongodb');
var mongo_url = generate_mongo_url({});
db = mongoose.connect(mongo_url),
Schema = mongoose.Schema;

var AccountsSchema = new Schema({
 	email: String,
 	password: String,
	name: String,	     
	startup: String,
	url: String,
	id: String
});

mongoose.model('Accounts',AccountsSchema);
module.exports = mongoose.model('Accounts');
