var mongoose = require('mongoose');
var Messages = require('../models/messages');
var Accounts = require('../models/accounts');


exports.create = function(req, res){
	Accounts.findOne({_id: req.params.account_id},function(err, account){
		var message = new Messages({text:req.body.text, url: req.body.url, account_id : req.params.account_id});
		message.save(function(){
			res.statusCode = 201;
			res.send({id: message._id});
		});
	});
};

exports.get = function(req, res){
	Messages.findOne({_id: req.params.message_id, account_id: req.params.account_id}, {_id: 0, account_id: 0},function(err,message){
		res.statusCode = 200;
		message.id=req.params.message_id;
		res.send(message);
	});
};