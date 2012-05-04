var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId

var messages_schema = new Schema({
 	text: String,
	url: String,
	id: String,
	account_id: ObjectId
});

mongoose.model('Messages',messages_schema);
module.exports = mongoose.model('Messages');