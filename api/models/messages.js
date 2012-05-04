var mongoose = require('mongoose');
Schema = mongoose.Schema;

var messages_schema = new Schema({
 	text: String,
	url: String,
	id: String
});

module.exports = messages_schema;