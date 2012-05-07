var mongoose = require('mongoose');
var Messages = require('../models/messages');
var Accounts = require('../models/accounts');

exports.create = function(req, res){
	Accounts.findOne({_id: req.params.account_id}, {}, function (err, account){
		var message = new Messages(req.body);
		message.account_id = account.id;
		message.save(function(){
			res.statusCode = 201;
			res.send({id: message._id});
		});
	});
};

exports.get = function(req, res){
	Messages.findOne({_id: req.params.message_id}, {}, function (err, message){
		res.send(message.returnJSON());
	});
};