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
	if(req.params.account_id == 'me'){
		res.send(req.user.returnJSON());
	}else{
		Accounts.findOne({_id: req.params.account_id}, {}, function (err, account){
			res.send(account.returnJSON());
		});
	}
};

exports.update = function(req, res){
	var account = Accounts.update({_id: req.params.account_id},req.body,{safe:true},function(err,account){
		res.statusCode = 204;
		res.send();	
	});
};

exports.update_password = function(req, res){
	Accounts.findOne({_id: req.params.account_id}, {}, function (err, selected_account){
		var account = new Accounts(selected_account);
		account.password = req.body.password;
		account.save(function(){
			res.statusCode = 204;
			res.send({id: account._id});
		});
	});
}

exports.get_credentials = function(req, res){
	Accounts.findOne({_id: req.params.account_id}, {credentials: 1}, function (err, account){								
		res.statusCode = 200;
		res.send(account.credentials);
	});
};

exports.logged = function(req, res){
	res.send(req.user);
};

exports.login = function(req, res){
	res.render('login.jade');
};