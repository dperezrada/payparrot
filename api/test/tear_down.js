exports.remove_all = function(callback){
	var db = require('payparrot_models/libs/mongodb').connect(),
		Accounts = require('payparrot_models/objects/accounts'),
		Parrots = require('payparrot_models/objects/parrots'),
		PotentialUsers = require('payparrot_models/objects/potential_users');
		Suscriptions = require('payparrot_models/objects/suscriptions');
	Accounts.remove({}, function(err, data){
		Parrots.remove({}, function(err, data){
			PotentialUsers.remove({}, function(err, data){
				Suscriptions.remove({}, function(err, data){
					callback();
				});
			});
		});
	});
};