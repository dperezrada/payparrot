Notifications = require('payparrot_models/objects/notifications.js'),

exports.validate = function(req, res) {
	if (req.params.notification_id == "" || req.query.account_id == "") {
		res.throw_error(err, 404);
		return;
	}
	try {
		Notifications.findOne({_id: req.params.notification_id, account_id: req.query.account_id},function(err,notification){
			// try {
			// 	if (notification) {
		 			// res.statusCode = 200;
		 			// res.send(notification);
			// 	} else {
			// 		res.throw_error(err, 404);
			// 	}
			// } catch (err) {
			// 	res.throw_error(err, 503);
			// }
			res.statusCode = 200;
		 	res.send(notification.type);		
	 	});
	} catch (err) {
		res.throw_error(err, 503);
	}
 }