var	Suscriptions = require('payparrot_models/objects/suscriptions'),
	_ = require('underscore'),
	async = require('async'),
	queue = require('payparrot_models/libs/queue');

var first_payment = function(suscription, callback){
	queue.createMessage('payments', {
			MessageBody: JSON.stringify({'suscription_id': suscription._id, 'account_id': suscription.account_id, 'parrot_id': suscription.parrot_id})
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


// TO DO: Notification type
// {
// 	subscription_activated,
// 	payment_success,
// 	payment_failed,
// 	subscription_deactivated
// }
// var send_notification = function(suscription, notification_type, callback){
// 	queue.createMessage('notifications', {
// 			MessageBody: JSON.stringify({'suscription_id': suscription._id, 'account_id': suscription.account_id, 'parrot_id': suscription.parrot_id, 'type': notification_type})
// 		}, function(err){
// 			if(!err){
// 				Suscriptions.update(
// 					{'_id': suscription._id}, {'$set': {'notified': true}},
// 					function(){
// 						first_payment(suscription, callback);
// 					}
// 				);
// 			}else{
// 				callback();
// 			}
// 		}
// 	);
// };

var db = require('payparrot_models/libs/mongodb').connect({});
Suscriptions.find({'active': true, 'first_tweet': false}, {}, function (err, suscriptions){
	async.forEach(suscriptions, function(item, callback){first_payment(item,callback)}, function(err){
		db.connection.close();
	});
});