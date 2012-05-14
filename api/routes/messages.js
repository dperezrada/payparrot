var mongoose = require('mongoose');
var Messages = require('payparrot_models/objects/messages');
var Accounts = require('payparrot_models/objects/accounts');
var _ = require('underscore');

exports.create = function(req, res){
	Accounts.findOne({_id: req.params.account_id}, {}, function (err, account){
		var message = new Messages(req.body);
		message.account_id = account._id;
		message.status = 0;
		message.active = 1;
		message.save(function(){
			res.statusCode = 201;
			res.send({id: message._id, status: 0, active: 1});
		});
	});
};

exports.get = function(req, res){
	Messages.findOne({_id: req.params.message_id}, {account_id: 0}, function (err, message){
		res.send(message.returnJSON());
	});
};

exports.list = function(req, res){
	Messages.find({account_id: req.params.account_id}, {account_id: 0}, function (err, messages){
		var messages_ = _.map(messages, function(message){return message.returnJSON()})
		res.send(messages_);
	});
};

exports.update = function(req, res){
	Messages.findOne({_id: req.params.message_id}, {}, function (err, message){
		_.extend(message,req.body);
		message.save(function(){
			res.statusCode = 204;
			res.send();
		});
	});
}
