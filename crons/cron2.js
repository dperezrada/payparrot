var	_ = require('underscore'),
	async = require('async'),
	queue = require('payparrot_models/libs/queue'),
	Parrots = require('payparrot_models/objects/parrots.js'),
	Messages = require('payparrot_models/objects/messages.js'),
	Payments = require('payparrot_models/objects/payments.js'),
	NextPayments = require('payparrot_models/objects/next_payments.js'),
	oauth = require('payparrot_models/libs/twitter_oauth.js'),
	db = require('payparrot_models/libs/mongodb').connect();
	
var send_notification = function(payment, notification_type, callback){
	console.log("Sending notification");
	queue.createMessage('notifications', {
			MessageBody: JSON.stringify({'account_id': payment.account_id, 'parrot_id': payment.parrot_id, 'type': notification_type})
		}, function(err){
			if(!err){
				callback();
				console.log("Notification sent");
			}else{
				console.log("Notification error");
				callback();
			}
		}
	);
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

// TODO: Manage errors
process_payment = function(payment_message, callback){
	Parrots.findOne({_id: payment_message.Body.parrot_id}, {account_id: 0}, function (err, parrot){
		if(parrot){
			console.log({_id: payment_message.Body.parrot_id});
			Messages.findOne({account_id: payment_message.Body.account_id}, {account_id: 0}, function (err, message){
				oauth_twitter = oauth.create_session();
				console.log(parrot);
				oauth_twitter.post(
					"https://api.twitter.com/1/statuses/update.json",
					parrot.oauth_token, 
					parrot.oauth_token_secret, 
					{"status": message.text+" "+message.url}, 
					function(err, response){
						var payment_entry = {
							twitter_response: JSON.parse(response),
							action_date: new Date(),
							account_id: payment_message.Body.account_id,
							parrot_id: payment_message.Body.parrot_id
						}
						if(!err){
							payment_entry.success = true;
						}else{
							payment_entry.success = false;
						}
						var payment = new Payments(payment_entry);
						payment.save(function (err) {
							queue.deleteMessage('payments', payment_message.ReceiptHandle, function(err){
								async.parallel([
								    function(callback_1){
								    	//Create notification
										send_notification(payment,'payment_success',callback_1);
								    },
								    function(callback_2){
								    	//Create next payment
								    	create_next_payment(payment,callback_2);
								    },
								], function(err){
									callback();
								});
							});
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
				// process_payment(message, callback);
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