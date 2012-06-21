var Accounts = require('payparrot_models/objects/accounts.js');
var Suscriptions = require('payparrot_models/objects/suscriptions.js');
var Payments = require('payparrot_models/objects/payments.js');
var Plans = require('payparrot_models/objects/plans.js');
var AccountsPlans = require('payparrot_models/objects/accounts_plans.js');
var pp_stats = require('payparrot_models/libs/stats.js');
var _ = require('underscore');
var crypto = require('crypto');
var async = require('async');

var ObjectId = require('mongoose').Types.ObjectId;

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
	if(req.user.setup){
		if (req.user.subscriptions) {
			res.redirect('/app.html');
		} else {
			res.redirect('/accounts/subscriptions');	
		}		
	} else {
		res.redirect('/accounts/setup');	
	}
	
};

exports.login = function(req, res){
	res.render('login.ejs');
};

exports.signup = function(req, res){
	Accounts.findOne({email: req.body.email},function(err,account){
		if (account) {
			res.render('signedup.ejs',{layout: true, status: false, params: req.body});
		} else {
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
					res.render('signedup.ejs',{layout: true, status: true});
				}
			}); 	
		}
	});
	//res.render('signup.ejs');
};

exports.setup = function(req,res) {
	res.render('steps.ejs', {account_id: req.user._id});
}

exports.subscriptions = function(req,res) {
	res.render('subscriptions.ejs', {account_id: req.user._id});
}

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

exports.update_plan = function(req,res) {

	var get_plan = function(account, callback){
		Plans.findOne({name: req.body.name}, function(err,plan){
			if(err) callback(err);
			else {
				if (!plan) {
					callback(err, null);
				} else {
					callback(null, account, plan);
				}
			}
		});	
	};
	var create_account_plan = function(account, plan, callback){
		var plan_data = plan.toJSON();
		delete plan_data._id;
		plan_data['active'] = true;
		plan_data['account_id'] = account._id;
		AccountsPlans.findOne({account_id: req.params.account_id, active:1}, function (err, account_plan){
			if(err) callback(err);
			else{
				var new_account_plan = new AccountsPlans(plan_data);
				new_account_plan.save(function(err){
					if(err) callback(err);
					else {
						callback(null, account_plan, new_account_plan);
					}
				});
			}
		});			
	};
	var update_account_plan = function(account_plan, new_account_plan, callback){
		if (account_plan) {
			account_plan.active = false;
			account_plan.save(function(err){
				if (!err) callback(null, new_account_plan);
				else calback(err);
			});
		} else {
			callback(null, new_account_plan);
		}						
	};
	async.waterfall(
		[
			async.apply(get_plan, req.user),
			create_account_plan,
			update_account_plan
		],
		function(err, account_plan){
			if(err) res.throw_error(err, 503);
			else res.send({"id": account_plan._id});
		}
	);
}
exports.get_plan = function(req,res) {
	AccountsPlans.findOne({account_id: req.params.account_id, active: true}, function (err, account_plan){
		if(err) res.throw_error(err, 503);
		else if(!account_plan) res.throw_error(null, 404);
		else {
			res.send(account_plan.returnJSON());
		}
	});
};
