Notifications = require('payparrot_models/objects/notifications.js'),

exports.get = function(req, res) {
	if (req.params.notification_id == "" || req.query.account_id == "") {
		res.throw_error(err, 404);
		return;
	}else{
		Notifications.findOne({_id: req.params.notification_id, account_id: req.params.account_id},function(err,notification){
			if(err) res.throw_error(err, 503);
			else{
				if (notification) {
					res.statusCode = 200;
		 			res.send(notification.returnJSON());
				}else{
					res.throw_error(err, 404);
				}
			}
		});
	}
}

exports.echo = function(req, res) {
	console.log("echo");
	console.log(req.body);
	res.send("OK");
}