Notifications = require('payparrot_models/objects/notifications.js'),

exports.validate = function(req, res) {
	if (req.params.notification_id == "" || req.query.account_id == "") {
		return;
	}

 	Notifications.findOne({_id: req.params.notification_id, account_id: req.query.account_id},function(err,notification){
 		console.log(req.params.notification_id);
 		console.log(req.query.account_id);
 		if (notification) {
 			console.log("4");
 			res.statusCode = 200;
 			res.send(notification);
 		} else {
 			console.log("5");
 			res.statusCode = 404;
 			res.send({});
 		}
 	});
 }