Notifications = require('payparrot_models/objects/notifications.js'),

exports.get = function(req, res) {
	if (req.params.notification_id == "" || req.query.account_id == "") {
		res.throw_error(err, 404);
		return;
	}
	try {
		Notifications.findOne({_id: req.params.notification_id, account_id: req.params.account_id},function(err,notification){
			if (notification) {
				res.statusCode = 200;
	 			res.send(notification.returnJSON());
			}else{
				res.throw_error(err, 404);
			}
	 	});
	} catch (err) {
		res.throw_error(err, 503);
	}
 }