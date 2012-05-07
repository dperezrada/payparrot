module.exports = 
	generate_mongo_url = function(obj){
	  obj.hostname = (obj.hostname || 'localhost');
	  obj.port = (obj.port || 27017);
	  obj.db = (obj.db || 'mydb1');

	  if(obj.username && obj.password){
	    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
	  }
	  else{
	    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
	  }
	}
