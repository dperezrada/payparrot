var mongoose = require('mongoose')
	,Schema = mongoose.Schema
	,_ = require('underscore')
	,returnJSON = require('./utils').returnJSON;

var payments_schema = new Schema({
 	text : String,
 	url : String,
 	parrot_id : String,
 	account_id : String,
 	suscription_id : String, 
	id : String,
	created_at : Date
}, {strict:true});

mongoose.model('Tweets', tweets_schema);
module.exports = Tweets = mongoose.model('Tweets');

Tweets.prototype.returnJSON = returnJSON;