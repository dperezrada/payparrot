// var mongoose = require('mongoose');
// var Tweets = require('../models/tweets.js');
// var Suscriptions = require('../models/suscriptions.js');
// var _ = require('underscore');

// exports.get_tweets = function(req, res){
// 	var account_id = req.params.account_id;
// 	var querystring = req.query;
	
// 	if( !querystring.from ) { querystring.from = 0; }
// 	if( !querystring.to ) { querystring.to = querystring.from+20}

// 	Suscriptions
// 		.find({'account_id':account_id},{'parrot_id':1,'_id':0})
// 		.sort('_id', )
// 		.skip(querystring.from)
// 		.limit(querystring.to)
// 		.run( function (err, suscriptions){
// 			var parrot_suscriptions = _.map(suscriptions, function (num, key){return num.parrot_id;});
// 			Parrots.find().where('_id').in(parrot_suscriptions).run(function (err, parrots){
				
// 			});
// 		});
// }