var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var payments_schema = new Schema({
	success: Boolean,
	twitter_response: {type: Schema.Types.Mixed, private: true},
	created_at: {type: Date, default: Date.now},
	account_id: String,
	parrot_id: String,
	message_id: String,
	message_id_sqs: String,
	callback_url: String
});

mongoose.model('Payments', payments_schema);
var payments = mongoose.model('Payments');
module.exports = payments;

// payments.prototype.returnJSON = returnJSON;