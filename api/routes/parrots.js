var Accounts = require('payparrot_models/objects/accounts.js'),
	Parrots = require('payparrot_models/objects/parrots.js'),
	Sessions = require('payparrot_models/objects/sessions.js'),
	Suscriptions = require('payparrot_models/objects/suscriptions.js'),
	Notifications = require('payparrot_models/objects/notifications.js'),
	_ = require('underscore'),
	oauth = require('payparrot_models/libs/twitter_oauth.js');
		
exports.start = function(req, res){
	Accounts.findOne({'credentials.public_token': req.query.token}, {}, function (err, account){
		try {
			if(account){
				var oauth_twitter = oauth.create_session();
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
				res.throw_error(err, 404);
			}
		} catch (err) {
			res.throw_error(err, 503);
		}
	});
};

exports.finish = function(req, res){
	try {
		Sessions.findOne({'oauth_token': req.query.oauth_token}, {}, function (err, session){
			if (session) {
				Accounts.findOne({'_id': session.account_id}, {}, function (err, account){
					if (account) {
						var oauth_twitter = oauth.create_session();
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
														suscription.external_id = session.external_id
														suscription.save(function(){
															// encolar notificacion
															var notification = new Notifications({
																'account_id': account._id,
																'parrot_id': parrot._id,
																'type': 'suscription_activated',
																'suscription_id': suscription._id,
																'external_id': suscription.external_id,
																'request_url': account.notification_url
															});
															notification.save(function(){
																// TODO: add parameters
																var parameters = "";
																var sep = "?";
																if(account.callback_url.indexOf('?')>=0){
																	sep = "&";
																}
																if(session.external_id){
																	parameters = sep+"external_id="+session.external_id;
																}
																if(suscription._id){
																	parameters = parameters+"&subscription_id="+suscription._id.toString();
																}
																parameters = parameters+"&notification_id="+notification._id;
																res.redirect(account.callback_url+parameters);
															});												
														});
													});
												});
											});
										}
									});
								}
							});						
					}
				});
			}
		});
	} catch (err) {
		res.throw_error(err,503);
	}
};

function clean_parrots(parrots, account_id){
	_.each(parrots, function(parrot){
		parrot.payments = _.filter(parrot.payments, function(payment){ return payment.account_id  == account_id; });
	});
}

exports.get_parrots = function(req, res){
	var account_id = req.params.account_id;
	var querystring = req.query;
	
	if( !querystring.from ) { querystring.from = 0; }
	if( !querystring.to ) { querystring.to = querystring.from+9}
	
	if ( querystring.screen_name ){
		var screen_name = new RegExp(querystring.screen_name,'gi'); 
		Parrots
			.find({'twitter_info.screen_name':screen_name})
			.sort('_id', 'descending')
			.skip(querystring.from)
			.limit(querystring.to)
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
	} else if( querystring.suscription_start && querystring.suscription_end ){
		Suscriptions
			.find({'account_id':account_id},{'parrot_id':1,'_id':0})
			.sort('_id', 'descending')
			.where('created_at')
			.gte(new Date(querystring.suscription_start))
			.lte(new Date(querystring.suscription_end))
			.skip(querystring.from)
			.limit(querystring.to)
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
			.skip(querystring.from)
			.limit(querystring.to)
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
