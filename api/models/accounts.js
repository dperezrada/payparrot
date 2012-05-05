var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accounts_schema = new Schema({
 	email: String,
 	password: String,
	name: String,	     
	startup: String,
	url: String,
	id: String,
	credentials: []
});
// TODO: Check problem with redefine
accounts_schema.pre('save', function(next){
	this.credentials = {'public_token':1};
	next();
});

mongoose.model('Accounts', accounts_schema);
module.exports = Accounts = mongoose.model('Accounts');

Accounts.prototype.returnJSON = function(){
	var to_return = this.toJSON();
	to_return['id'] = to_return['_id'];
	delete to_return['password'];
	delete to_return['credentials'];
	delete to_return['_id'];
	return to_return;
}