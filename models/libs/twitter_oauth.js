OAuth= require('oauth').OAuth;

exports.create_session = function(){
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
