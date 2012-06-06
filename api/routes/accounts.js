var Accounts = require('payparrot_models/objects/accounts.js');
var Suscriptions = require('payparrot_models/objects/suscriptions.js');
var Payments = require('payparrot_models/objects/payments.js');
var _ = require('underscore');
var crypto = require('crypto');
var async = require('async');

exports.create = function(req, res){;
	var account = new Accounts(req.body);
	var current_date = (new Date()).valueOf().toString();
	var random = Math.random().toString();
	account.credentials = {
		'public_token': crypto.createHash('sha1').update(current_date + random).digest('hex'),
		'private_token': crypto.createHash('sha1').update(current_date + random).digest('hex')
	};
	account.create_password(req.body.password);
	account.save(function(){
	res.statusCode = 201;
	res.send({id: account._id});
	}); 
};

function set_stats(account, callback) {
	account.stats = {
		parrots_total: 0,
		parrots_today: 0,
		payments_total: 0,
		payments_today: 0
	}
	async.parallel([
	    function(callback_){
			Suscriptions
			.count({'account_id':account._id,'active':1})
			.run(function (err, suscriptions){
				account.stats.parrots_total = suscriptions;
				callback_();
			});	    	
	    },
	    function(callback_){
			var date_start = new Date();
			date_start = new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate());
			var date_end = new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate()+1);
			Suscriptions
			.count({'account_id':account._id,'active':1})
			.where('created_at')
			.gte(date_start)
			.lte(date_end)
			.run(function (err, suscriptions_today){
				account.stats.parrots_today = suscriptions_today;
				callback_();
			});	    	
	    },
		function(callback_){
			Payments
			.count({'account_id':account._id, 'success': true})
			.run(function (err, payments){
				account.stats.payments_total = payments;
				callback_();
			});	    	
	    },
	    function(callback_){
			var date_start = new Date();
			date_start = new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate());
			var date_end = new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate()+1); 
			Payments
			.count({'account_id':account._id, 'success': true})
			.where('created_at')
			.gte(date_start)
			.lte(date_end)
			.run(function (err, payments_today){
				account.stats.payments_today = payments_today;
				callback_();
			});	    	
	    }
	], function(err, results){
		callback();
	});
}

exports.get = function(req, res){
	var account_id = req.params.account_id;
	if(account_id == 'me'){
		var user = req.user.returnJSON();
		var account_id = user.id;
	}
	Accounts.findOne({'_id': account_id}, {}, function (err, account){
		try {
			if (account) {
				set_stats(account, function(){
					res.send(account.returnJSON());
				});
			} else {
				res.statusCode = 404;
				res.send("Not found");
			}
			a = account.hola;
		} catch (err) {
			res.statusCode = 503;
			res.send("Error 503");
		}
	});
};

exports.update = function(req, res){
	Accounts.findOne({_id: req.params.account_id}, {}, function (err, account){
		try {
			if (account) {
				_.extend(account,req.body);
				if(req.body.password){
					account.create_password(req.body.password);
				}
				account.save(function(){
					res.statusCode = 204;
					res.send();
				});
			} else {
				res.statusCode = 404;
				res.send("Not found");
			}
			a = account.hola;
		} catch (err) {
			res.statusCode = 503;
			res.send("Error 503");
		}
	});
}

exports.get_credentials = function(req, res){
	Accounts.findOne({_id: req.params.account_id}, {credentials: 1}, function (err, account){								
		try {
			if (account) {
				res.statusCode = 200;
				res.send(account.credentials);
			} else {
				res.throw_error(err, 404);
			}
		} catch (err) {
			res.throw_error(err, 503);
		}

	});
};

exports.logged = function(req, res){
	// res.redirect('/app.html');
	res.render('redirect_app.ejs');
};

exports.login = function(req, res){
	res.render('login.ejs');
};

exports.token_auth = function(req, res, next){
	var token = req.query.token;
	var account_id = req.query.account_id;
	if(!account_id){
		account_id = req.params.account_id;
	}
	Accounts.findOne({'_id':account_id,'credentials.private_token': req.query.token}, {}, function (err, account){
		try {
			if (account) {
				return next();
			} else {
				// TODO: CHANGE STATUS
				res.throw_error(err, 404);
			}
		} catch (err) {
			res.throw_error(err, 503);
		}
	});

	
}
