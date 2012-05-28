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

var db = require('payparrot_models/libs/mongodb').connect({});
Suscriptions.find({'active': true, 'first_tweet': false}, {}, function (err, suscriptions){
	async.forEach(suscriptions, function(item, callback){first_payment(item,callback)}, function(err){
		db.connection.close();
	});
});