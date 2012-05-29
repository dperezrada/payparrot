var mongoose = require('mongoose');
var config = require('payparrot_configs');

var mongo_url = exports.mongo_url = function(){
	var obj = {}
	obj.hostname = (config.DB.HOST || 'localhost');
	obj.port = (config.DB.PORT || 27017);
	obj.db = (config.DB.NAME || 'payparrot_1');

	if(config.DB.USER && config.DB.PASSWORD){
		obj.username = config.DB.USER;
		obj.password = config.DB.PASSWORD;
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