var	_ = require('underscore'),
	async = require('async'),
	queue = require('payparrot_models/libs/queue'),
	Accounts = require('payparrot_models/objects/accounts.js'),
	Suscriptions = require('payparrot_models/objects/suscriptions.js'),
	Notifications = require('payparrot_models/objects/notifications.js'),
	request = require('request');


// TODO: Manage errors
var notify = function(notification_message, callback){
	var query_data = {
		suscription_id:"",
		account_id:"",
		parrot_id:"",
		type:"",
		external_id: "",
		twitter_info: "",
		notification_id: ""
	};
	// console.log(notification_message);
	Notifications.findOne({_id: notification_message.Body.notification_id}, function (err, notification){
		if (notification) {
			console.log("Notificando...");
			console.log(notification_message.Body.type);
			switch(notification_message.Body.type){
				case "payment_success":
					console.log("payment_success");
					query_data.type = "payment_success";
					break;
				case "payment_failed":
					console.log("payment_failed");
					query_data.type = "payment_failed";
					break;
				case "suscription_activated":
					console.log("suscription_activated");
					query_data.type = "suscription_activated";
					break;
				case "suscription_deactivated":
					console.log("suscription_deactivated");
					query_data.type = "suscription_deactivated";
					break;
				default:
					console.log("default");
			};

			if (notification_message.request_url != "") {
				query_data.suscription_id = notification.suscription_id.toString();
				query_data.account_id = notification.account_id.toString();
				query_data.parrot_id = notification.parrot_id.toString();
				query_data.external_id = notification.external_id.toString();
				query_data.notification_id = notification._id.toString();

				request.post(
					{
						url: notification.request_url,
						form: query_data
					}, 
					function (error, response, body) {
						// If response start with 2XX we are ok
						if(String(response.statusCode).indexOf("2") == 0){
							notification.response_status = response.statusCode;
							notification.response_headers = response.headers;
							notification.response_body = response.body;
							notification.status = "sent";
							notification.save(function(){
								queue.deleteMessage('notifications', notification_message.ReceiptHandle, function(err){
									callback();
								});
							});
						}
						else{
							callback();
						}
					}
				);
			} else {
				console.log("Notification couldn't be sent");
				callback();
			}
		} else {
			callback();
		}
	});
};

var has_messages = true;

var main = function(callback){
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
			if(callback){
				callback(err);
			}
	    }
	);
};
exports.main = main;

if (!module.parent) {
	var db = require('payparrot_models/libs/mongodb').connect();
	main(function(){
		db.connection.close();
	});
}