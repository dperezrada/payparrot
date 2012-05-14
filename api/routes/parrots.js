var mongoose = require('mongoose'),
	Accounts = require('payparrot_models/objects/accounts.js'),
	Parrots = require('payparrot_models/objects/parrots.js'),
	Sessions = require('payparrot_models/objects/sessions.js'),
	Suscriptions = require('payparrot_models/objects/suscriptions.js'),
	_ = require('underscore'),
	OAuth= require('oauth').OAuth;

var oauth_session = function(){
	twitter_config = {
		'request_token_url': 'https://api.twitter.com/oauth/request_token',
		'authorize_url': 'https://api.twitter.com/oauth/authorize',
		'access_token_url': 'https://api.twitter.com/oauth/access_token',
		'callback_url': 'http://localhost:3000/parrots/finish',
		'consumer_key': 'lFkPrTmvjcSUD5JtrOvg',
		'consumer_secret': 'sCxLuVAd1HnGIjdolKUqAjZaSOO7BGhViD1a7w',
		'version': '1.0',
		'signature': 'HMAC-SHA1'
	};

	return new OAuth(
		twitter_config.request_token_url,
		twitter_config.access_token_url,
		twitter_config.consumer_key,
		twitter_config.consumer_secret,
		twitter_config.version,
		twitter_config.callback_url,
		twitter_config.signature
	);
};

exports.start = function(req, res){
	Accounts.findOne({'credentials.public_token': req.query.token}, {}, function (err, account){
		if(account){
			var oauth_twitter = oauth_session();
			oauth_twitter.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
				if (error) {
					console.log(error);
					res.send("Problem ocurred")
				}
				else {
					var session = new Sessions({
						'account_id': account._id,
						'oauth_token': oauth_token,
						'oauth_token_secret': oauth_token_secret,
						'oauth_results': results
					});
					if(req.query.external_id){
						session.external_id = req.query.external_id;
					}
					session.save(function(){
						res.redirect(twitter_config.authorize_url+'?oauth_token='+oauth_token);
					});
				}
			});
		}else{
			res.statusCode = 404;
			res.send("Not Found");			
		}
	});
};

exports.finish = function(req, res){
	Sessions.findOne({'oauth_token': req.query.oauth_token}, {}, function (err, session){
		Accounts.findOne({'_id': session.account_id}, {}, function (err, account){
			var oauth_twitter = oauth_session();
			oauth_twitter.getOAuthAccessToken(session.oauth_token,session.oauth_token_secret, req.query.oauth_verifier, 
				function(error, oauth_access_token, oauth_access_token_secret, results){
					if (error){
						console.log(error);
						res.send("Not authorized");
					} else {
						oauth_twitter.get("https://api.twitter.com/1/account/verify_credentials.json", oauth_access_token, oauth_access_token_secret, function(error, data) {
							if (error){
								console.log(error);
								res.send("Not authorized");
							} else {
								var twitter_info = JSON.parse(data);
								Parrots.findOne({'twitter_id': twitter_info.id_str}, {}, function (err, parrot){
									if(!parrot){
										parrot = new Parrots({});
									}
									parrot.twitter_id = twitter_info.id_str;
									parrot.account_id = account._id;
									parrot.oauth_token = oauth_access_token;
									parrot.oauth_token_secret = oauth_access_token_secret;
									parrot.twitter_info = twitter_info;
									parrot.save(function(){
										Suscriptions.findOne({'account_id': account._id, 'parrot_id': parrot._id}, {}, function (err, suscription){
											if(!suscription){
												suscription = new Suscriptions();
											}
											suscription.parrot_id = parrot._id;
											suscription.account_id = account._id;
											suscription.active = true;
											suscription.save(function(){
												// encolar notificacio
												// TODO: add parameters
												res.redirect(account.callback_url);
											});
										});
									});
								});
							}
						});
					}
				});
		});
	});
}
