var Accounts = require('payparrot_models/objects/accounts.js');
var Suscriptions = require('payparrot_models/objects/suscriptions.js');
var Payments = require('payparrot_models/objects/payments.js');
var pp_stats = require('payparrot_models/libs/stats.js');
var _ = require('underscore');
var crypto = require('crypto');
var async = require('async');

exports.create = function(req, res){;
	var account = new Accounts(req.body);
	var current_date = (new Date()).valueOf().toString();
	account.credentials = {
		'public_token': crypto.createHash('sha1').update(current_date + Math.random().toString()).digest('hex'),
		'private_token': crypto.createHash('sha1').update(current_date + Math.random().toString()).digest('hex')
	};
	account.create_password(req.body.password);
	account.save(function(err){
		if(err) res.throw_error(err, 503);
		else{
			res.statusCode = 201;
			res.send({id: account._id});
		}
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
	    async.apply(pp_stats.parrots_total, account),
	    async.apply(pp_stats.parrots_today, account),
		async.apply(pp_stats.payments_total, account),
		async.apply(pp_stats.payments_today, account)
	], function(err, results){
		callback(err, results);
	});
}

exports.get = function(req, res){
	var account_id = req.params.account_id;
	if(account_id == 'me'){
		var user = req.user.returnJSON();
		var account_id = user.id;
	}
	Accounts.findOne({'_id': account_id}, {}, function (err, account){
		if(err) res.throw_error(err, 503);
		else{
			if (account) {
				set_stats(account, function(err_stats, results){
					if(err_stats) res.throw_error(err_stats, 503);
					else{
						res.send(account.returnJSON());
					}
				});
			} else {
				res.throw_error(null, 404);
			}
		}
	});
};

exports.update = function(req, res){
	Accounts.findOne({_id: req.params.account_id}, {}, function (err, account){
		if(err) res.throw_error(err, 503);
		else{
			if (account) {
				_.extend(account,req.body);
				if(req.body.password){
					account.create_password(req.body.password);
				}
				account.save(function(err_save){
					if(err_save) res.throw_error(err_save, 503);
					else{
						res.statusCode = 204;
						res.send();
					}
				});
			} else {
				res.throw_error(null, 404);
			}
		}
	});
}

exports.get_credentials = function(req, res){
	Accounts.findOne({_id: req.params.account_id}, {credentials: 1}, function (err, account){								
		if(err) res.throw_error(err, 503);
		else{
			if (account) {
				res.statusCode = 200;
				res.send(account.credentials);
			} else {
				res.throw_error(null, 404);
			}
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
		if(err) res.throw_error(err, 503);
		else{
			if (account) {
				return next();
			} else {
				// TODO: CHANGE STATUS
				res.throw_error(null, 404);
			}
		}
	});

	
}
