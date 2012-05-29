var Messages = require('payparrot_models/objects/messages');
var Payments = require('payparrot_models/objects/payments');
var Accounts = require('payparrot_models/objects/accounts');
var _ = require('underscore');

exports.create = function(req, res){
	Accounts.findOne({_id: req.params.account_id}, {}, function (err, account){
		try {
			if (account) {
				var message = new Messages(req.body);
				message.account_id = account._id;
				message.status = 0;
				message.active = 1;
				message.save(function(){
					res.statusCode = 201;
					res.send({id: message._id, status: 0, active: 1});
				});				
			} else {
				res.throw_error(err, 404);
			}
		} catch (err) {
			res.throw_error(err, 503);
		}		
	});
};

exports.get = function(req, res){
	Messages.findOne({_id: req.params.message_id}, {account_id: 0}, function (err, message){
		try {
			if (message) {
				res.send(message.returnJSON());
			} else {
				res.throw_error(err, 404);
			}
		} catch (err) {
			res.throw_error(err, 503);
		}
	});
};

exports.list = function(req, res){
	Messages.find({account_id: req.params.account_id}, {account_id: 0}, function (err, messages){
		try {
			var messages_ = _.map(messages, function(message){return message.returnJSON()})
			res.send(messages_);
		} catch (err) {
			res.throw_error(err, 503);
		}		
	});
};

exports.update = function(req, res){
	Messages.findOne({_id: req.params.message_id}, {}, function (err, message){
		try {
			if (message) {
				_.extend(message,req.body);
				message.save(function(){
					res.statusCode = 204;
					res.send(); 
				});
			} else {
				res.throw_error(err, 404);
			}
		} catch (err) {
			res.throw_error(err, 503);
		}
	});
}

exports.route = function(req, res){
	Payments.findOne({message_id_sqs: req.params.message_id_sqs}, {callback_url: 1}, function (err, payment){
		try {
			if (payment) {
				res.redirect(payment.callback_url);
			} else {
				res.throw_error(err, 404);
			}
		} catch (err) {
			res.throw_error(err, 503);
		}
	});
};