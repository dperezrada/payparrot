var mongoose = require('mongoose')
	,Schema = mongoose.Schema
	,_ = require('underscore')
	,crypto = require('crypto')
	,bcrypt = require('bcrypt')
	,returnJSON = require('./utils').returnJSON;

var accounts_schema = new Schema({
 	email: String,
 	password: {type: String, private: true},
	salt: {type: String, private: true},
	name: String,	     
	startup: String,
	url: String,
	id: String,
	callback_url: String,
	credentials: {type: Schema.Types.Mixed, private: true}
}, {strict:true});

accounts_schema.method('verify_password', function(password, callback) {
  var received_password = crypto.createHash('sha1').update(this.salt + password).digest('hex');
  if(received_password == this.password){
  	callback(null, true);
  }else{
  	return callback(null, false);
  }
});

accounts_schema.static('authenticate', function(email, password, callback) {
	this.findOne({ email: email }, function(err, account) {
  		if (err) { return callback(err); }
  		if (!account) { return callback(null, false); }
  		account.verify_password(password, function(err, passwordCorrect) {
  			if (err) { return callback(err); }
  			if (!passwordCorrect) { return callback(null, false); }
  			return callback(null, account);
  		});
  	});
});

// TODO: Check problem with redefine
accounts_schema.pre('save', function(next){
	var current_date = (new Date()).valueOf().toString();
	var random = Math.random().toString();
	if(this.password){
		this.salt = random;
  		this.password = crypto.createHash('sha1').update(this.salt + this.password).digest('hex');
  	}
	next();
});

mongoose.model('Accounts', accounts_schema);
var Accounts = mongoose.model('Accounts');
module.exports = Accounts;

Accounts.prototype.returnJSON = returnJSON;
