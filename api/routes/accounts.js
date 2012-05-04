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
	Accounts.findOne({_id: req.params.account_id}, {_id: 0, password: 0,messages:0}, function (err, account){
		account.id = req.params.account_id;
		res.send(account);
	});
};

exports.update = function(req, res){
	var account = Accounts.update({_id: req.params.account_id},req.body,{safe:true},function(err,account){
		res.statusCode = 204;
		res.send();	
	});
};