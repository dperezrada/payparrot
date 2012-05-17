exports.remove_all = function(callback){
	var db = require('payparrot_models/libs/mongodb').connect(),
		Accounts = require('payparrot_models/objects/accounts'),
		Parrots = require('payparrot_models/objects/parrots');
	Accounts.remove({}, function(err, data){
		Parrots.remove({}, function(err, data){
			callback();
		});
	});
};