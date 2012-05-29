var NextPayments = require('payparrot_models/objects/next_payments.js'),
	Suscriptions = require('payparrot_models/objects/suscriptions'),
	db = require('payparrot_models/libs/mongodb').connect(),
	async = require('async'),
	queue = require('payparrot_models/libs/queue'),
	db = require('payparrot_models/libs/mongodb').connect({});

var queue_next_payment = function(payment, callback){
	queue.createMessage('payments', {
			MessageBody: JSON.stringify({'suscription_id': payment.suscription_id, 'account_id': payment.account_id, 'parrot_id': payment.parrot_id})
		}, function(err){
			if(!err){
				NextPayments.remove({_id: payment._id}, function(err){
					callback();
				});
			}else{
				callback();
			}
		}
	);
};

var get_suscription = function(payment, callback){
	Suscriptions.findOne({'account_id': payment.account_id, 'parrot_id': payment.parrot_id}, {}, function (err, suscription){
		try{
			if(!err && suscription){
				payment.suscription_id = suscription._id;
				queue_next_payment(payment, callback);
			}else{
				callback();
			}
		}catch(e){
			callback();
		}
	});
};

NextPayments
	.find({},{'parrot_id':1,'account_id':1,'_id':1})
	.sort('_id', 'descending')
	.where('action_date')
	.lte(new Date())
	.run(function (err, next_payments){
			console.log(next_payments);
			console.log(new Date());
			async.forEach(next_payments, function(item, callback){get_suscription(item, callback)}, function(err){
				db.connection.close();
			});
	});