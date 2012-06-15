var Accounts = require('payparrot_models/objects/accounts.js');
var Suscriptions = require('payparrot_models/objects/suscriptions.js');
var Payments = require('payparrot_models/objects/payments.js');

exports.parrots_total = function(account, callback){
	Suscriptions
	.count({'account_id':account._id,'active':1})
	.run(function (err, suscriptions){
		if(err){
			callback(err, null);
		}else{
			account.stats.parrots_total = suscriptions;
			callback(null, 'OK');
		}
	});	    	
};

exports.parrots_today = function(account, callback){
	var date_start = new Date();
	date_start = new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate());
	var date_end = new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate()+1);
	Suscriptions
	.count({'account_id':account._id,'active':1})
	.where('created_at')
	.gte(date_start)
	.lte(date_end)
	.run(function (err, suscriptions_today){
		if(err){
			callback(err, null);
		}else{
			account.stats.parrots_today = suscriptions_today;
			callback(null, 'OK');
		}
	});	    	
}

exports.payments_total = function(account, callback){
	Payments
	.count({'account_id':account._id, 'success': true})
	.run(function (err, payments){
		if(err){
			callback(err, null);
		}else{
			account.stats.payments_total = payments;
			callback(null, 'OK');
		}
	});	    	
};

exports.payments_today = function(account, callback){
	var date_start = new Date();
	date_start = new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate());
	var date_end = new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate()+1); 
	Payments
	.count({'account_id':account._id, 'success': true})
	.where('created_at')
	.gte(date_start)
	.lte(date_end)
	.run(function (err, payments_today){
		if(err){
			callback(err, null);
		}else{
			account.stats.payments_today = payments_today;
			callback(null, 'OK');
		}
	});	    	
};