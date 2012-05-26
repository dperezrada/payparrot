var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON,
	async = require('async');
	

var queue = require('payparrot_models/libs/queue');

var Notifications_schema = new Schema({
	suscription_id: Schema.ObjectId,
	account_id: Schema.ObjectId,
	external_id: String,
	parrot_id: String,
	request_url: String,
	// Integer doesn't exists. Needs to be forced as integer? Or just a Number?
	response_status: Number,
	response_headers: String,
	response_body: String,
	status: String,
	type: String,
	created_at: {type: Date, default: Date.now},
	queue_message_id: String
});

Notifications_schema.pre('save', function (next) {
	var self = this;
	if(!self.queue_message_id){
		async.series([
			function(callback){
				queue.createMessage('notifications', {
					MessageBody: JSON.stringify({'suscription_id': self.suscription_id, 'account_id': self.account_id, 'parrot_id': self.parrot_id, 'type': self.type})
					}, function(err, result){
						console.log(JSON.stringify({'suscription_id': self.suscription_id, 'account_id': self.account_id, 'parrot_id': self.parrot_id, 'type': self.type}));
						console.log(err);
						console.log(result);
						callback();
					}
				);
			}
		]
		,function(err, results){
			console.log('a')
			next();
		});
	}else{
		next();
	}
});

mongoose.model('Notifications', Notifications_schema);
module.exports = Notifications = mongoose.model('Notifications');


Notifications.prototype.returnJSON = returnJSON;