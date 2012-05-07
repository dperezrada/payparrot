exports.remove_all = function(callback){
	var mongoose = require('mongoose'),
		mongo_url = require('../libs/mongodb').mongo_url({}),
		db = mongoose.connect(mongo_url),
		Accounts = require('../models/accounts');
	Accounts.remove({}, function(err, data){
		callback();
	});
};