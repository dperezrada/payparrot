var	_ = require('underscore'),
	async = require('async'),
	queue = require('payparrot_models/libs/queue'),
	Accounts = require('payparrot_models/objects/accounts.js'),
	Suscriptions = require('payparrot_models/objects/suscriptions.js'),
	Notifications = require('payparrot_models/objects/notifications.js'),
	request = require('request'),
	db = require('payparrot_models/libs/mongodb').connect();


// TODO: Manage errors
notify = function(notification_message, callback){
	var query_data = {
		suscription_id:"",
		account_id:"",
		parrot_id:"",
		type:"",
		external_id: ""
	};
	Suscriptions.findOne(
		{
			account_id: notification_message.Body.account_id,
			parrot_id: notification_message.Body.parrot_id
		}, {},function (err, suscription){
			Accounts.findOne({_id: notification_message.Body.account_id}, {account_id: 0}, function (err, account){

				var notification = new Notifications();

				switch(notification_message.Body.type){
					case "payment_success":
						console.log("payment_success");
						query_data.type = "payment_success";
						notification.type = query_data.notification_type;
						break;
					case "payment_failed":
						console.log("payment_failed");
						query_data.type = "payment_failed";
						notification.type = query_data.notification_type;						
						break;
					case "suscription_activated":
						console.log("suscription_activated");
						query_data.type = "suscription_activated";
						notification.type = query_data.notification_type;						
						break;
					case "suscription_deactivated":
						console.log("suscription_deactivated");
						query_data.type = "suscription_deactivated";
						notification.type = query_data.notification_type;						
						break;
					default:
						console.log("default");
				};

				if (account != null && typeof account.notification_url != "undefined") {
					// request.post?

					notification.account_id = account._id;
					notification.external_id = suscription.external_id;
					notification.parrot_id = suscription.parrot_id;
					notification.request_url = account.notification_url;

					query_data.suscription_id = suscription.id;
					query_data.account_id = notification.account_id;
					query_data.parrot_id = notification.parrot_id;
					query_data.external_id = notification.external_id;

					request.post(
						{
							url: account.notification_url,
							json: query_data
						}, 
						function (error, response, body) {
							notification.response_status = response.statusCode;
							notification.response_headers = response.headers;
							notification.response_body = response.body;
							notification.save(function(){
								queue.deleteMessage('notifications', notification_message.ReceiptHandle, function(err){
									callback();
								});
							});
						}
					);					
				} else {
					console.log("Notification couldn't be sent");
					callback();
				}
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