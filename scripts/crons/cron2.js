var	_ = require('underscore'),
	async = require('async'),
	queue = require('payparrot_models/libs/queue'),
	Parrots = require('payparrot_models/objects/parrots.js'),
	Messages = require('payparrot_models/objects/messages.js'),
	Payments = require('payparrot_models/objects/payments.js'),
	Suscriptions = require('payparrot_models/objects/suscriptions.js'),
	Notifications = require('payparrot_models/objects/notifications.js'),
	Accounts = require('payparrot_models/objects/accounts.js'),
	NextPayments = require('payparrot_models/objects/next_payments.js'),
	oauth = require('payparrot_models/libs/twitter_oauth.js'),
	db = require('payparrot_models/libs/mongodb').connect();
	
var send_notification = function(payment, notification_type, callback){
	console.log("Sending notification");
	Suscriptions.findOne({account_id: payment.account_id, parrot_id: payment.parrot_id},function(err,suscription){
		if (suscription) {
			Accounts.findOne({_id: payment.account_id}, function (err, account){
				if (account) {
					var notification = new Notifications({
						'account_id': payment.account_id, 
						'parrot_id': payment.parrot_id, 
						'type': notification_type,
						'suscription_id': suscription._id,
						'external_id': suscription.external_id,
						'request_url': account.notification_url
					});
					notification.save(function(){
						callback();
					});
				} else {
					callback();
				}
			});
		} else {
			callback();
		}
	});	
};

var create_next_payment = function(last_payment, callback){
	var last_date = new Date(last_payment.created_at);
	var next_action_date = new Date(last_date.getFullYear(),last_date.getMonth()+1,last_date.getDate());
	var next_payment = new NextPayments({
		account_id: last_payment.account_id,
		parrot_id: last_payment.parrot_id,
		action_date: next_action_date
	});
	next_payment.save(function (err) {
		console.log("Next payment creado");
		callback();
	});
};

var encode_url = function(message_id){
	return 'http://payparrot.com/r/'+message_id;
}

// TODO: Manage errors
process_payment = function(payment_message, callback){
	Parrots.findOne({_id: payment_message.Body.parrot_id}, {account_id: 0}, function (err, parrot){
		if(parrot){
			console.log({account_id: payment_message.Body.account_id, status: 1, active: 1})
			//console.log({_id: payment_message.Body.parrot_id});
			Messages.find({account_id: payment_message.Body.account_id, status: true, active: true}, {account_id: 0}, function (err, messages){
				console.log(messages);
				console.log(payment_message.Body.account_id);
				if (messages.length == 0) {
					console.log("No active & validated messages available");
					callback();
					return;
				}
				message = messages[Math.floor(Math.random()*messages.length)];
				oauth_twitter = oauth.create_session();
				//console.log(parrot);
				var encoded_url = encode_url(payment_message.MessageId);
				oauth_twitter.post(
					"https://api.twitter.com/1/statuses/update.json",
					parrot.oauth_token, 
					parrot.oauth_token_secret, 
					{"status": message.text+" "+encoded_url}, 
					function(err, response){
						// Mnesjae + 140 caracteres
						// Twitter está down
						// Perdió autorización
						// Mensaje
						var payment_entry = {
							twitter_response: JSON.parse(response),
							action_date: new Date(),
							account_id: payment_message.Body.account_id,
							parrot_id: payment_message.Body.parrot_id,
							message_id: message._id,
							message_id_sqs: payment_message.MessageId,
							callback_url: message.url
						}
						if(!err){
							payment_entry.success = true;
						}else{
							payment_entry.success = false;
						}
						var payment = new Payments(payment_entry);
						payment.save(function (err) {
							if(payment_entry.success){
								queue.deleteMessage('payments', payment_message.ReceiptHandle, function (err){
									console.log("Payment succeeded");
									async.parallel([
									    function(callback_){
									    	//Create notification
											send_notification(payment,'payment_success',callback_);
									    },
									    function(callback_){
									    	//Create next payment
									    	create_next_payment(payment,callback_);
									    },
										function(callback_){
									    	//Save current payment inside parrot object
									    	console.log(payment.twitter_response.text);
									    	console.log(payment.twitter_response.created_at);
									    	parrot.payments.push({
									    		'account_id': payment_message.Body.account_id,
									    		'text': payment.twitter_response.text,
									    		'created_at': payment.twitter_response.created_at,
									    	});
									    	parrot.save(function(){
									    		callback_();	
									    	});
									    	
									    },									    
									], function(err){
										callback();
									});
								});
							}else{
								// callback();
								// Get attempt from DB
								console.log("Failed");
								Payments.count({MessageId: payment_message.MessageId},function(err,count) {
									Suscriptions.findOne({account_id: payment.account_id, parrot_id: payment.parrot_id},function(err,suscription){
										if (suscription) {
											if(count >= 3){
												console.log("Attempt "+count);
												suscription.active = false;
												suscription.save(function() {
													//TODO send_notification failed
													queue.deleteMessage('payments', payment_message.ReceiptHandle, function (err){
														send_notification(payment,'suscription_deactivated',function(){
															callback();
														});														
													});													
												});
											} else {
												console.log("Attempt "+count);
											 	callback();
											}
										}
									});
								});
							}
						});
					}
				);
			});
		}else{
			callback();
		}
	});
};

var has_messages = true;

async.whilst(
    function () { return has_messages; },
    function(callback){
		queue.getMessage('payments', function(message){
			if(message){
				console.log("message");
				async.forEach([message], process_payment, function(result){
					callback();
				});
			}else{
				console.log("no_message");
				has_messages = false;
				callback();
			}
		});
	},
    function (err) {
		if(err){
			console.log("An error ocurred");
			console.log(err);
		}
		db.connection.close();
    }
);