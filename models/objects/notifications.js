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
	status: {type: String, default: 'pending'},
	type: String,
	created_at: {type: Date, default: Date.now, private: true},
	queue_message_id: String
});

Notifications_schema.pre('save', function (next) {
	var self = this;
	if(!self.queue_message_id){
		async.series([
			function(callback){
				queue.createMessage('notifications', {
					MessageBody: JSON.stringify({'suscription_id': self.suscription_id, 'account_id': self.account_id, 'parrot_id': self.parrot_id, 'type': self.type, 'notification_id': self._id})
					}, function(err, result){
						var queue_message_id = result.SendMessageResult.MessageId;
						if(queue_message_id){
							self.queue_message_id = queue_message_id;
						}
						callback();
					}
				);
			}
		]
		,function(err, results){
			next();
		});
	}else{
		next();
	}
});

mongoose.model('Notifications', Notifications_schema);
var Notifications = mongoose.model('Notifications');
module.exports = Notifications;


Notifications.prototype.returnJSON = returnJSON;