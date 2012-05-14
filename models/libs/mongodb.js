var mongoose = require('mongoose');
var mongo_url = exports.mongo_url = function(obj){
	obj.hostname = (obj.hostname || 'localhost');
	obj.port = (obj.port || 27017);
	obj.db = (obj.db || 'payparrot_1');

	if(obj.username && obj.password){
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