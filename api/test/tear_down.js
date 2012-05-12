exports.remove_all = function(callback){
	var mongoose = require('mongoose'),
		mongo_url = require('payparrot_models/libs/mongodb').mongo_url({}),
		db = mongoose.connect(mongo_url),
		Accounts = require('payparrot_models/objects/accounts');
	Accounts.remove({}, function(err, data){
		callback();
	});
};