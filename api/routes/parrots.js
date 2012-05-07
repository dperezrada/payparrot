var mongoose = require('mongoose');
var Accounts = require('../models/accounts.js');
var Parrots = require('../models/parrots.js');
var _ = require('underscore');
var OAuth= require('oauth').OAuth;

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
					var parrot = new Parrots({
						'account_id': account._id,
						'oauth_token': oauth_token,
						'oauth_token_secret': oauth_token_secret,
						'oauth_results': results,
					});
					if(req.query.external_id){
						parrot.external_id = req.query.external_id;
					}
					parrot.save(function(){
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
	Parrots.findOne({'oauth_token': req.query.oauth_token}, {}, function (err, parrot){
		Accounts.findOne({'_id': parrot.account_id}, {}, function (err, account){
			var oauth_twitter = oauth_session();
			oauth_twitter.getOAuthAccessToken(parrot.oauth_token,parrot.oauth_token_secret, req.query.oauth_verifier, 
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
								parrot.twitter_info = JSON.parse(data);
								parrot.active = true;
								parrot.save(function(){
									res.redirect(account.callback_url);
								});
							}
						});
					}
				});
		});
	});
}