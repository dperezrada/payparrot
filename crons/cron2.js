var	_ = require('underscore'),
	async = require('async'),
	queue = require('payparrot_models/libs/queue'),
	Parrots = require('payparrot_models/objects/parrots.js'),
	Messages = require('payparrot_models/objects/messages.js'),
	Payments = require('payparrot_models/objects/payments.js'),
	oauth = require('payparrot_models/libs/twitter_oauth.js'),
	db = require('payparrot_models/libs/mongodb').connect();
	
var has_messages = true;
// TODO: Manage errors
process_payment = function(payment_message, callback){
	Parrots.findOne({_id: payment_message.Body.parrot_id}, {account_id: 0}, function (err, parrot){
		Messages.findOne({account_id: payment_message.Body.account_id}, {account_id: 0}, function (err, message){
			oauth_twitter = oauth.create_session();
			oauth_twitter.post("https://api.twitter.com/1/statuses/update.json", parrot.oauth_token, parrot.oauth_token_secret, {"status": message.text+" "+message.url}, function(err, response){
				var payment_entry = {
					twitter_response: JSON.parse(response)
				}
				if(!err){
					payment_entry.success = true;
				}else{
					payment_entry.success = false;
				}
				var payment = new Payments(payment_entry);
				payment.save(function (err) {
					queue.deleteMessage('payments', message.ReceiptHandle, function(err){
					callback();
				});
			});
		});
	});
};

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