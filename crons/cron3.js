var	_ = require('underscore'),
	async = require('async'),
	queue = require('payparrot_models/libs/queue'),
	Accounts = require('payparrot_models/objects/accounts.js'),
	Suscriptions = require('payparrot_models/objects/suscriptions.js'),
	request = require('request'),
	db = require('payparrot_models/libs/mongodb').connect();


// TODO: Manage errors
notify = function(notification_message, callback){
	Suscriptions.findOne(
		{
			account_id: notification_message.Body.account_id,
			parrot_id: notification_message.Body.parrot_id
		}, {},function (err, suscription){
			Accounts.findOne({_id: notification_message.Body.account_id}, {account_id: 0}, function (err, account){
				switch(notification_message.Body.type){
					case "payment_success":
						console.log("payment_success");
						break;
					case "payment_failed":
						console.log("payment_failed");
						break;
					case "suscription_activated":
						console.log("suscription_activated");
						break;
					case "suscription_deactivated":
						console.log("suscription_deactivated");
						break;
					default:
						console.log("default");
				};
				request.get(account.notification_url, function (error, response, body) {
					var notification = new Notifications();
					notification.account_id = account._id;
					notification.external_id = suscription.external_id;
					notification.parrot_id = suscription.parrot_id;
					notification.request_url = account.notification_url;
					notification.response_status = response.statusCode;
					notification.response_headers = response.headers;
					notification.response_body = response.body;
					notification.save(function(){
						queue.deleteMessage('notifications', notification_message.ReceiptHandle, function(err){
							callback();
						});
					});

				});
			});
		}
	);
};

var has_messages = true;

async.whilst(
    function () { return has_messages; },
    function(callback){
		queue.getMessage('notifications', function(message){
			if(message){
				console.log("message");
				async.forEach([message], notify, function(result){
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