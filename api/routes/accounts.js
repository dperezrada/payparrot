var mongoose = require('mongoose');
var Accounts = require('../models/accounts.js'),
	Parrots = require('../models/parrots.js'),
	Suscriptions = require('../models/suscriptions.js');
var _ = require('underscore');
var crypto = require('crypto');

exports.create = function(req, res){
	var account = new Accounts(req.body);
	var current_date = (new Date()).valueOf().toString();
	var random = Math.random().toString();
	account.credentials = {'public_token': crypto.createHash('sha1').update(current_date + random).digest('hex')};
	account.save(function(){
		res.statusCode = 201;
		res.send({id: account._id});
	});
};

// var today_parrots_array = _.map(suscriptions, 
// 										function (num, key){
// 											var created_on = new Date(num.created_on.getFullYear(), num.created_on.getMonth(), num.created_on.getDate());
// 											var today = new Date();
// 											today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
// 											if((today - created_on) == 0){
// 												return num;
// 											} 
// 										});
// 				var today_parrots = today_parrots_array.length();
// 				var parrots_id_array = _.map(suscriptions, function (num, key){ return num.parrot_id });
// 				Tweets.find().where('parrot_id').in(parrots_id_array).run(function (err, tweets){
					
// 				});

exports.get = function(req, res){
	var account_id = req.params.account_id;
	if(account_id == 'me'){
		var user = req.user.returnJSON();
		var account_id = user.id;
	}
	Accounts.findOne({'_id': account_id}, {}, function (err, account){
			account.stats = {};
			Suscriptions
			.count({'account_id':account._id,'active':1})
			.run(function (err, suscriptions){
				account.stats.parrots_total = suscriptions;
				var date_start = new Date();
				date_start = new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate());
				var date_end = new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate()+1); 
				Suscriptions
				.count({'account_id':account._id,'active':1})
				.where('created_on')
				.gte(date_start)
				.lte(date_end)
				.run(function (err, suscriptions_today){
					account.stats.parrots_today = suscriptions_today;
					Tweets
					.count({'account_id':account._id})
					.run(function (err, tweets_total){
						account.stats.tweets_total = tweets_total;
						Tweets
						.count({'account_id':account._id})
						.where('created_on')
						.gte(date_start)
						.lte(date_end)
					})
				});
 			});
			
		}
	);
};

exports.update = function(req, res){
	Accounts.findOne({_id: req.params.account_id}, {}, function (err, account){
		_.extend(account,req.body);
		account.save(function(){
			res.statusCode = 204;
			res.send();
		});
	});
}

exports.get_credentials = function(req, res){
	Accounts.findOne({_id: req.params.account_id}, {credentials: 1}, function (err, account){								
		res.statusCode = 200;
		res.send(account.credentials);
	});
};

exports.logged = function(req, res){
	res.send(req.user);
};

exports.login = function(req, res){
	res.render('login.ejs');
};

exports.token_auth = function(req, res, next){
	var token = req.query.token;
	var account_id = req.query.account_id
	Accounts.findOne({'_id':account_id,'credentials.public_token': req.query.token}, {}, function (err, account){
		if(account){
			if(account._id == req.params.account_id){
				return next();
			}else{
				res.send({'status':'failed','message':'Trying to access to private account. This issue will be logged'});
			}
		}else{
			res.send({'status':'failed','message':'invalid token or account id'})
		}
	});

	
}
