var mongoose = require('mongoose');
var Accounts = require('../models/accounts.js');
var _ = require('underscore');
var crypto = require('crypto');

exports.create = function(req, res){
	var account = new Accounts(req.body);
	var current_date = (new Date()).valueOf().toString();
	var random = Math.random().toString();
	account.credentials = {'public_token': crypto.createHash('sha1').update(current_date + random).digest('hex')};
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
	Accounts.findOne({_id: req.params.account_id}, {}, function (err, account){
		_.extend(account,req.body);
		account.save(function(){
			res.statusCode = 204;
			res.send();
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
	res.render('login.ejs');
};