var mongoose = require('mongoose');
var Accounts = mongoose.model('Accounts',require('../models/accounts'));
var Messages = mongoose.model('Messages',require('../models/messages'));


exports.create = function(req, res){
	Accounts.findOne({_id: req.params.id},function(err,doc){
		var message = new Messages({text:req.body.text, url: req.body.url});
		doc.messages.push(message);
		doc.save(function(){
			res.statusCode = 201;
			res.send({id: message._id});
		});
	});
};

exports.get = function(req, res){
	Accounts.find({"messages._id": req.params.message_id},{"messages._id": 0},function(err,docs){
		res.statusCode = 200;
		var message = docs[0].messages[0];
		message.id=req.params.message_id;
		res.send(message);	
	});
};