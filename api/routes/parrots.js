var Accounts = require('payparrot_models/objects/accounts.js'),
	Parrots = require('payparrot_models/objects/parrots.js'),
	Sessions = require('payparrot_models/objects/sessions.js'),
	Suscriptions = require('payparrot_models/objects/suscriptions.js'),
	Notifications = require('payparrot_models/objects/notifications.js'),
	_ = require('underscore'),
	oauth = require('payparrot_models/libs/twitter_oauth.js'),
	async = require('async');

// API /parrots/start Helpers methods

var get_account_from = function(select, callback){
	Accounts.findOne(select, {}, function(err, account){
		if(err) callback(err, null);
		else if(!account) callback('Not found', null);
		else callback(null, account);
	});
}
var get_twitter_request_token = function(account, callback){
	var oauth_twitter = oauth.create_session();
	oauth_twitter.getOAuthRequestToken(
		function(err, oauth_token, oauth_token_secret, results){
			callback(err, account, oauth_twitter, oauth_token, oauth_token_secret, results);
		}
	);	
};

var create_session = function(external_id, account, oauth_twitter, oauth_token, oauth_token_secret, results, callback){
	var session = new Sessions({
		'account_id': account._id,
		'oauth_token': oauth_token,
		'oauth_token_secret': oauth_token_secret,
		'oauth_results': results
	});
	if(external_id){
		session.external_id = external_id;
	}
	session.save(function(err){
		if(err) callback(err, null);
		else{
			callback(null, oauth.twitter_config.authorize_url+'?oauth_token='+oauth_token);
		}
	});
};

// API /parrots/finish Helpers methods

var get_session_from = function(select, callback){
	Sessions.findOne(select, {}, function (err, session){
		if(err) callback(err, null);
		else if(!session) callback('Not found', null);
		else callback(null, session);
	});
}
var get_account_from_session = function(session, callback){
	Accounts.findOne({'_id': session.account_id}, {}, function(err, account){
		if(err) callback(err, null);
		else if(!account) callback('Not found', null);
		else callback(null, account, session);
	});
}
var get_twitter_access_token = function(oauth_verifier, account, session, callback){
	var oauth_twitter = oauth.create_session();
	oauth_twitter.getOAuthAccessToken(session.oauth_token, session.oauth_token_secret, oauth_verifier, 
		function(err, oauth_access_token, oauth_access_token_secret, results){
			if(err) callback('Not authorized', null);
			else callback(null, account, session, oauth_twitter, oauth_access_token, oauth_access_token_secret, results);
		}
	);
}
var verify_credentials = function(account, session, oauth_twitter, oauth_access_token, oauth_access_token_secret, results, callback){
	oauth_twitter.get("https://api.twitter.com/1/account/verify_credentials.json", oauth_access_token, oauth_access_token_secret, function(err, data) {
		if(err) callback('Not authorized', null);
		else callback(null, account, session, JSON.parse(data), oauth_access_token, oauth_access_token_secret);
	});
}
var get_parrot_from = function(account, session, twitter_info, oauth_access_token, oauth_access_token_secret, callback){
	Parrots.findOne({'twitter_id': twitter_info.id_str}, {}, function(err, parrot){
		if(err) callback(err, null);
		else{
			if(!parrot) parrot = new Parrots({});
			callback(null, account, session, twitter_info, oauth_access_token, oauth_access_token_secret, parrot);
		}
	});
}

var create_parrot = function(account, session, twitter_info, oauth_access_token, oauth_access_token_secret, parrot, callback){
	parrot.twitter_id = twitter_info.id_str;
	parrot.account_id = account._id;
	parrot.oauth_token = oauth_access_token;
	parrot.oauth_token_secret = oauth_access_token_secret;
	parrot.twitter_info = twitter_info;
	parrot.save(function(err){
		if(err) callback(err, null);
		else callback(null, account, session, twitter_info, oauth_access_token, oauth_access_token_secret, parrot);
	});
}

var get_suscription_from = function(account, session, twitter_info, oauth_access_token, oauth_access_token_secret, parrot, callback){
	Suscriptions.findOne({'account_id': account._id, 'parrot_id': parrot._id}, {}, function (err, suscription){
		if(err) callback(err, null);
		else{
			if(!suscription){
				suscription = new Suscriptions();
			}
			suscription.parrot_id = parrot._id;
			suscription.account_id = account._id;
			suscription.active = true;
			suscription.external_id = session.external_id
			suscription.save(function(){
				callback(null, account, session, twitter_info, oauth_access_token, oauth_access_token_secret, parrot, suscription);
			});
		}
	})
};

var create_notification = function(account, session, twitter_info, oauth_access_token, oauth_access_token_secret, parrot, suscription, callback){
	var notification = new Notifications({
		'account_id': account._id,
		'parrot_id': parrot._id,
		'type': 'suscription_activated',
		'suscription_id': suscription._id,
		'external_id': suscription.external_id,
		'request_url': account.notification_url
	});
	notification.save(function(err){
		if(err) callback(err, null);
		else callback(null, account, session, twitter_info, oauth_access_token, oauth_access_token_secret, parrot, suscription, notification);		
	});
};

var generate_redirect_url = function(account, session, twitter_info, oauth_access_token, oauth_access_token_secret, parrot, suscription, notification, callback){
	// TODO: add parameters
	var parameters = "";
	var sep = "?";
	if(account.callback_url.indexOf('?')>=0){
		sep = "&";
	}
	if(typeof session.external_id != "undefined"){
		parameters = sep+"external_id="+session.external_id;
	}
	if(suscription._id){
		parameters = parameters+"&subscription_id="+suscription._id.toString();
	}
	parameters = parameters+"&notification_id="+notification._id;
	callback(null, account.callback_url+parameters);
}

// Utils
function clean_parrots(parrots, account_id){
	_.each(parrots, function(parrot){
		parrot.payments = _.filter(parrot.payments, function(payment){ return payment.account_id  == account_id; });
	});
}

// API methods

exports.start = function(req, res){
	async.waterfall(
		[
			async.apply(get_account_from, {'credentials.public_token': req.query.token}),
			get_twitter_request_token,
			async.apply(create_session, req.query.external_id)
		],
		function(err, redirect_url){
			if(err == 'Not found') res.throw_error(null, 404);
			else if(err) res.throw_error(err, 503)
			else res.redirect(redirect_url);
		}
	)
};

exports.finish = function(req, res){
	async.waterfall(
		[
			async.apply(get_session_from, {'oauth_token': req.query.oauth_token}),
			get_account_from_session,
			async.apply(get_twitter_access_token, req.query.oauth_verifier),
			verify_credentials,
			get_parrot_from,
			create_parrot,
			get_suscription_from,
			create_notification,
			generate_redirect_url
		]
		,function(err, redirect_url){
			if(err == 'Not found') res.throw_error(null, 404);
			else if(err == 'Not authorized') res.throw_error(null, 401);
			else if(err) res.throw_error(err, 503)
			else res.redirect(redirect_url);
		}
	);
};

exports.get_one = function(req,res) {
	var account_id = req.params.account_id;
	var parrot_id = req.params.parrot_id;

	try {
		Suscriptions.findOne({parrot_id: parrot_id, account_id: account_id}, function(err,suscription) {
			if (suscription) {
				res.send(suscription);
			}
			else {
				res.throw_error(err, 404);		
			}
		});
	} catch (err) {
		res.throw_error(err, 503);
	}
}

exports.remove = function(req,res) {
	var account_id = req.params.account_id;
	var parrot_id = req.params.parrot_id;

	try {
		Suscriptions.remove({parrot_id: parrot_id, account_id: account_id}, function(err,suscription) {
			if (!err) {
				res.statusCode=204;
				res.send("");
			}
			else {
				res.throw_error(err, 404);		
			}
		});
	} catch (err) {
		res.throw_error(err, 503);
	}
}

exports.get_parrots = function(req, res){
	var account_id = req.params.account_id;
	var querystring = req.query;
	
	if( !querystring.skip ) { querystring.skip = 0; }
	if( !querystring.limit ) { querystring.limit = 10}
	
	if ( querystring.screen_name ){
		var screen_name = new RegExp(querystring.screen_name,'gi'); 
		Parrots
			.find({'twitter_info.screen_name':screen_name})
			.sort('_id', 'descending')
			.skip(querystring.skip)
			.limit(querystring.limit)
			.run(function (err, parrots){		
				var parrots_id_array = _.map(parrots, function (num, key){return num._id;});				
				Suscriptions
					.find({'account_id':account_id})
					.where('parrot_id').in(parrots_id_array)
					.run( function (err, suscriptions ){
						var suscriptions_parrot_id_array = _.map(suscriptions, function (num, key){return num.parrot_id.toString();});
						parrots_account = _.filter(
							parrots, 
							function (parrot){
								return _.indexOf(suscriptions_parrot_id_array,parrot._id.toString()) >= 0 
							}
						);
						parrots_account = _.map(parrots_account, function (num, key){num.id = num._id.toString(); delete num._id; return num});
						clean_parrots(parrots,account_id);
						res.send(parrots);
					});
			});
	} else if( querystring.from && querystring.to ){
		Suscriptions
			.find({'account_id':account_id},{'parrot_id':1,'_id':0})
			.sort('_id', 'descending')
			.where('created_at')
			.gte(new Date(querystring.from))
			.lte(new Date(querystring.to))
			.skip(querystring.skip)
			.limit(querystring.limit)
			.run(function (err, suscriptions){
				var suscriptions_parrot_id_array = _.map(suscriptions, function (num, key){return num.parrot_id.toString();});
				Parrots.find().where('_id').in(suscriptions_parrot_id_array).run(function (err, parrots){
					parrots = _.map(parrots, function (num, key){num.id = num._id.toString(); delete num._id; return num});
					clean_parrots(parrots,account_id);
					res.send(parrots);
				});
			});
	} else {
		Suscriptions
			.find({'account_id':account_id},{'parrot_id':1,'_id':0})
			.sort('_id', 'descending')
			.skip(querystring.skip)
			.limit(querystring.limit)
			.run( function (err, suscriptions){
				suscriptions = _.map(suscriptions, function (num, key){return num.parrot_id;});
				Parrots.find().where('_id').in(suscriptions).run(function (err, parrots){
					parrots = _.map(parrots, function (num, key){num.id = num._id.toString(); delete num._id; return num});
					clean_parrots(parrots,account_id);
					res.send(parrots);
				});
			});
	}

};
