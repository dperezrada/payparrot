var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messages_schema = require('./messages');

var accounts_schema = new Schema({
 	email: String,
 	password: String,
	name: String,	     
	startup: String,
	url: String,
	id: String,
	messages: [messages_schema],
});

module.exports = accounts_schema;
