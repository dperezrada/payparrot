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
	account.credentials = {'public_token': crypto.createHash('sha1').update(current_date + random).digest('hex')};
	account.create_password(req.body.password); 
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
			console.log(date_start);
			console.log(date_end);
			console.log({'account_id':account._id,'active':1});
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
			.count({'account_id':account._id,'active':1})
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
			.count({'account_id':account._id,'active':1})
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



	// 	account.stats.parrots_today = suscriptions_today;
	// 	Tweets
	// 	.count({'account_id':account._id})
	// 	.run(function (err, tweets_total){
	// 		account.stats.tweets_total = tweets_total;
	// 		Tweets
	// 		.count({'account_id':account._id})
	// 		.where('created_on')
	// 		.gte(date_start)
	// 		.lte(date_end)
	// 	})
	// });
	// });
}

exports.get = function(req, res){
	var account_id = req.params.account_id;
	if(account_id == 'me'){
		var user = req.user.returnJSON();
		var account_id = user.id;
	}
	Accounts.findOne({'_id': account_id}, {}, function (err, account){
			set_stats(account, function(){
				res.send(account.returnJSON());
			});
		}
	);
};

exports.update = function(req, res){
	Accounts.findOne({_id: req.params.account_id}, {}, function (err, account){
		_.extend(account,req.body);
		if(req.body.password){
			account.create_password(req.body.password);
		}
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
	// res.redirect('/app.html');
	res.render('redirect_app.ejs');
};

exports.login = function(req, res){
	res.render('login.ejs');
};
