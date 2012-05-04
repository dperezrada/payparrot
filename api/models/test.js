// Refactorizar
var mongoose = require('mongoose');
var generate_mongo_url = require('../libs/mongodb');
var mongo_url = generate_mongo_url({});

db = mongoose.connect(mongo_url),
Schema = mongoose.Schema;
//

var messages_schema = new Schema({
 	content: String,
 	url: String
});

var accounts_schema = new Schema({
 	email: String,
 	password: String,
	name: String,	     
	startup: String,
	url: String,
	id: String,
	messages: [messages_schema]
});

mongoose.model('Accounts',accounts_schema);
Accounts = mongoose.model('Accounts');

// var new_account = new Accounts({
// 	email: "memo@gmail.com",
//  	password: "lala",
// 	name: "Guillermo",	     
// 	startup: "Memo Inc",
// 	url: "http://memo.com/",
// });
// new_account.messages.push({
// 	content: "Mi primer mensaje",
// 	url: "Holi.com"
// });
// new_account.save(function(){});

//new_account.messages.find({},function(err,messages){
//	console.log(messages);
//});

Accounts.find({"messages._id": '4fa43549351aade91f000004'},{'messages':1},function(err,docs){
	console.log(docs);
});