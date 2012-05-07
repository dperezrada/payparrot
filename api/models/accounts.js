var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');
var crypto = require('crypto');
//for auth
var passport = require('passport');
var bcrypt = require('bcrypt');

var accounts_schema = new Schema({
 	email: String,
 	hash: {type: String, private: true},
	name: String,	     
	startup: String,
	url: String,
	id: String,
	credentials: {type: Schema.Types.Mixed, private: true}
});

//This will run every time password is required
accounts_schema
.virtual('password')
.get(function () {
  return this.hash;
})
.set(function (password) {
  var salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, salt);
});

accounts_schema.method('verify_password', function(password, callback) {
  bcrypt.compare(password, this.hash, callback);
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
	this.credentials = {'public_token': crypto.createHash('sha1').update(current_date + random).digest('hex')};
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