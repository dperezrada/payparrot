var mongodb = require('mongodb');

// REFACTOR THIS
var generate_mongo_url = function(obj){
  obj.hostname = (obj.hostname || 'localhost');
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'test');

  if(obj.username && obj.password){
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
  else{
    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
}

var mongourl = generate_mongo_url(mongodb);

exports.create = function(req, res){
	//res.statusCode = 201;
	require('mongodb').connect(mongourl, function(err, conn){
		conn.collection('accounts', function(err, coll){
			var account = req.body;
			coll.insert( account, {safe:true}, function(err){
				res.writeHead(201, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				});
				res.end(JSON.stringify({id: account._id}));
			});
		});
	});
	//res.send({id:'1'})
};

exports.get = function(req, res){
	var id = req.params.id;
	require('mongodb').connect(mongourl, function(err, conn){
		conn.collection('accounts', function(err, coll){
			coll.find({"_id": new mongodb.ObjectID(id)}, function(err, result){
				res.writeHead(200, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				});
				res.end(result);
			});
		});
	});
};