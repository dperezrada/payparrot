var mongoose = require('mongoose');
var mongo_url = exports.mongo_url = function(){
	var obj = {}
	obj.hostname = (process.env.PARROT_DB_HOST || 'localhost');
	obj.port = (process.env.PARROT_DB_PORT || 27017);
	obj.db = (process.env.PARROT_DB_NAME || 'payparrot_test');

	if(process.env.PARROT_DB_USER && process.env.PARROT_DB_PASS){
		obj.username = process.env.PARROT_DB_USER;
		obj.password = process.env.PARROT_DB_PASS;
		return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
	}
	else{
		return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
	}
}

exports.connect = function(){
	return mongoose.connect(mongo_url({}));
};
exports.disconnect = function(callback){
	return mongoose.connection.close();
};