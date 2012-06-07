 var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var next_payments_schema = new Schema({
	account_id: String,
	parrot_id: String,
	action_date: Date
});

mongoose.model('NextPayments', next_payments_schema);
var NextPayments = mongoose.model('NextPayments');
module.exports = NextPayments;

// payments.prototype.returnJSON = returnJSON;