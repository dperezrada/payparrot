var Accounts = require('payparrot_models/objects/accounts.js'),
	Parrots = require('payparrot_models/objects/parrots.js'),
	Sessions = require('payparrot_models/objects/sessions.js'),
	Suscriptions = require('payparrot_models/objects/suscriptions.js'),
	_ = require('underscore'),
	oauth = require('payparrot_models/libs/twitter_oauth.js');

exports.start = function(req, res){
	Accounts.findOne({'credentials.public_token': req.query.token}, {}, function (err, account){
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
			res.statusCode = 404;
			res.send("Not Found");			
		}
	});
};

exports.finish = function(req, res){
	Sessions.findOne({'oauth_token': req.query.oauth_token}, {}, function (err, session){
		Accounts.findOne({'_id': session.account_id}, {}, function (err, account){
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
};

exports.get_parrots = function(req, res){
	var account_id = req.params.account_id;
	var querystring = req.query;
	
	if( !querystring.from ) { querystring.from = 0; }
	if( !querystring.to ) { querystring.to = querystring.from+9}
	
	if ( querystring.screen_name ){
		var screen_name = new RegExp(querystring.screen_name,'gi'); 
		Parrots
			.find({'twitter_info.screen_name':screen_name})
			.sort('_id', 1)
			.skip(querystring.from)
			.limit(querystring.to)
			.run(function (err, parrots){		
				var parrots_id_array = _.map(parrots, function (num, key){return num._id;});				
				Suscriptions
					.find({'account_id':account_id})
					.where('parrot_id').in(parrots_id_array)
					.run( function (err, suscriptions ){
						console.log(suscriptions);
						var suscriptions_parrot_id_array = _.map(suscriptions, function (num, key){return num.parrot_id.toString();});
						parrots_account = _.filter(
							parrots, 
							function (parrot){
								return _.indexOf(suscriptions_parrot_id_array,parrot._id.toString()) >= 0 
							}
						);
						parrots_account = _.map(parrots_account, function (num, key){num.id = num._id.toString(); delete num._id; return num});
						res.send(parrots_account);
					});
			});
	} else if( querystring.suscription_start && querystring.suscription_end ){
		Suscriptions
			.find({'account_id':account_id},{'parrot_id':1,'_id':0})
			.sort('_id', 1)
			.where('created_on')
			.gte(querystring.suscription_start)
			.lte(querystring.suscription_end)
			.skip(querystring.from)
			.limit(querystring.to)
			.run(function (err, suscriptions){
				var suscriptions_parrot_id_array = _.map(suscriptions, function (num, key){return num.parrot_id.toString();});
				Parrots.find().where('_id').in(suscriptions_parrot_id_array).run(function (err, parrots){
					parrots = _.map(parrots, function (num, key){num.id = num._id.toString(); delete num._id; return num});
					res.send(parrots);
				});
			});
	} else {
		Suscriptions
			.find({'account_id':account_id},{'parrot_id':1,'_id':0})
			.sort('_id', 1)
			.skip(querystring.from)
			.limit(querystring.to)
			.run( function (err, suscriptions){
				suscriptions = _.map(suscriptions, function (num, key){return num.parrot_id;});
				Parrots.find().where('_id').in(suscriptions).run(function (err, parrots){
					parrots = _.map(parrots, function (num, key){num.id = num._id.toString(); delete num._id; return num});
					res.send(parrots);
				});
			});
	}
};
