var	mongo_url = require('payparrot_models/libs/mongodb').mongo_url({});
	Suscriptions = require('payparrot_models/objects/suscriptions'),
 	mongoose = require('mongoose'),
	_ = require('underscore'),
	async = require('async'),
	queue = require('payparrot_models/objects/queue');

var first_payment = function(suscription, callback){
	queue.createMessage('payments', {
			MessageBody: JSON.stringify({'suscription_id': suscription._id.toString(), 'account_id': suscription.account_id})
		}, function(err){
			if(!err){
				Suscriptions.update(
					{'_id': suscription._id}, {'$set': {'first_tweet': true}},
					function(){
						callback();
					}
				);
			}else{
				callback();
			}
		}
	);
};

var send_notification = function(suscription, callback){
	queue.createMessage('notifications', {
			MessageBody: JSON.stringify({'suscription_id': suscription._id.toString(), 'account_id': suscription.account_id})
		}, function(err){
			if(!err){
				Suscriptions.update(
					{'_id': suscription._id}, {'$set': {'notified': true}},
					function(){
						first_payment(suscription, callback);
					}
				);
			}else{
				callback();
			}
		}
	);
};

mongoose.connect(mongo_url, function(){
	Suscriptions.find({'active': true, 'notified': false}, {}, function (err, suscriptions){
		async.forEach(suscriptions, send_notification, function(err){
			mongoose.connection.close();
		});
	});
});