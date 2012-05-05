var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');

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
	this.credentials = {'public_token':1};
	next();
});

mongoose.model('Accounts', accounts_schema);
module.exports = Accounts = mongoose.model('Accounts');

Accounts.prototype.returnJSON = function(){
	var to_return = this.toJSON();
	_.each(accounts_schema.tree, function(value, key){
		if(value.private){
			delete to_return[key];
		}
	});
	to_return['id'] = to_return['_id'];
	delete to_return['_id'];
	return to_return;
}