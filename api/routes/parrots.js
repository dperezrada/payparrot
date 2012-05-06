var mongoose = require('mongoose');
var Accounts = require('../models/accounts.js');
var PosibleParrots = require('../models/posible_parrots.js');
var _ = require('underscore');
var OAuth= require('oauth').OAuth;

exports.start = function(req, res){
	Accounts.findOne({'credentials.public_token': req.query.token}, {}, function (err, account){
		if(account){
			var oauth_twitter = new OAuth(
				req.twitter_config.request_token_url,
				req.twitter_config.access_token_url,
				req.twitter_config.consumer_key,
				req.twitter_config.consumer_secret,
				req.twitter_config.version,
				req.twitter_config.callback_url,
				req.twitter_config.signature
			);
			
			oauth_twitter.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
				if (error) {
					console.log(error);
					res.send("Problem ocurred")
				}
				else {
					var posible_parrot = new PosibleParrots({
						'account_id': account._id,
						'oauth_token': oauth_token,
						'oauth_token_secret': oauth_token_secret,
						'oauth_results': results,
					});
					if(req.query.external_id){
						posible_parrot.external_id = req.query.external_id;
					}
					posible_parrot.save(function(){
						res.redirect(req.twitter_config.authorize_url+'?oauth_token='+oauth_token);
					});
				}
			});
		}else{
			res.statusCode = 404;
			res.send("Not Found");			
		}
	});
};
