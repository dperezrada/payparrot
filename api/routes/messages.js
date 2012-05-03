var mongodb = require('mongodb');

exports.create = function(req, res){
	mongodb.connect(req.mongo_url, function(err, conn){
		console.log("AAAAA");
		conn.collection('messages', function(err, coll){
			var message = req.body;
			message['account_id'] = new mongodb.ObjectID(req.params.id);
			coll.insert(message, {safe:true}, function(err){
				res.writeHead(201, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				});
				res.end(JSON.stringify({id: message._id}));
			});
		});
	});
};

exports.get = function(req, res){
	var id = req.params.message_id;
	mongodb.connect(req.mongo_url, function(err, conn){
		conn.collection('messages', function(err, coll){
			coll.findOne({"_id": new mongodb.ObjectID(id)}, {"_id": 0, 'account_id':0}, function(err, result){
				result['id'] = id;
				res.send(result);
			});
		});
	});
};