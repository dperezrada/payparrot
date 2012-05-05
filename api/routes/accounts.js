var mongoose = require('mongoose');
var Accounts = require('../models/accounts.js');
var _ = require('underscore');

exports.create = function(req, res){
	var account = new Accounts(req.body);
	account.save(function(){
		res.statusCode = 201;
		res.send({id: account._id});
	});
};

exports.get = function(req, res){
	Accounts.findOne({_id: req.params.account_id}, {}, function (err, account){
		res.send(account.returnJSON());
	});
};

exports.update = function(req, res){
	var account = Accounts.update({_id: req.params.account_id},req.body,{safe:true},function(err,account){
		res.statusCode = 204;
		res.send();	
	});
};

exports.get_credentials = function(req, res){
	Accounts.findOne({_id: req.params.account_id}, {credentials: 1}, function (err, account){								
		res.statusCode = 200;
		res.send(account.credentials);
	});
};