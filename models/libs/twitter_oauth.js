OAuth= require('oauth').OAuth;
var config = require('payparrot_configs');

var twitter_config = {
	'request_token_url': 'https://api.twitter.com/oauth/request_token',
	'authorize_url': 'https://api.twitter.com/oauth/authorize',
	'access_token_url': 'https://api.twitter.com/oauth/access_token',
	'callback_url': config.twitter_callback_url,
	'consumer_key': 'ygPaFatlRYsx1LqaJvFINA',
	'consumer_secret': '6v8AVGvbsd0t5M8CyDrhBLKks8PFoAfBeuxd508',
	'version': '1.0',
	'signature': 'HMAC-SHA1'
};
exports.twitter_config = twitter_config;

exports.create_session = function(){
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
