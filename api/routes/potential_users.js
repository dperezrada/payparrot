var PotentialUsers = require('payparrot_models/objects/potential_users');
var _ = require('underscore');

exports.create = function(req, res){
	var potential_user = new PotentialUsers();
	console.log("hola");
	console.log(req.body);
	potential_user.name = req.body.name;
	potential_user.email = req.body.email;
	potential_user.save(function(){
		res.statusCode = 201;
		res.send({id: potential_user._id});
	});
};
