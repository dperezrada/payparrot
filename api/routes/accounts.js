var mongodb = require('mongodb');

exports.create = function(req, res){
	//res.statusCode = 201;
	mongodb.connect(req.mongo_url, function(err, conn){
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
	mongodb.connect(req.mongo_url, function(err, conn){
		conn.collection('accounts', function(err, coll){
			coll.findOne({"_id": new mongodb.ObjectID(id)}, {"_id": 0, "password": 0}, function(err, result){
				result['id'] = id;
				res.send(result);
			});
		});
	});
};