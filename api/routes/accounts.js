var mongoose = require('mongoose');
var Accounts = mongoose.model('Accounts',require('../models/accounts.js'));
var _ = require('underscore');

exports.create = function(req, res){
	var account = new Accounts(req.body);
	account.save(function(){
		res.statusCode = 201;
		res.send({id: account._id});
	});
};

exports.get = function(req, res){
	Accounts.findOne({_id: req.params.id}, {_id: 0, password: 0,messages:0}, function (err, account){
		account.id = req.params.id;
		res.send(account);
	});
};