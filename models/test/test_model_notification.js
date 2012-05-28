var mongoose = require('mongoose'),
	mongo_url = require('payparrot_models/libs/mongodb').mongo_url({}),
	db = mongoose.connect(mongo_url),
	assert = require('assert'),
	Notification = require('payparrot_models/objects/notifications');
	
suite('Notifications', function(){
	var self;
	setup(function(done){
		this.notification_data = {
			suscription_id: new mongoose.Types.ObjectId(),
			account_id: new mongoose.Types.ObjectId(),
			external_id: new mongoose.Types.ObjectId(),
			parrot_id: new mongoose.Types.ObjectId(),
			request_url: 'localhost:3000',
			status: 'pending',
			type: 'suscription_activated'
		};

		this.notification = new Notification(this.notification_data);
		this.notification.save(function(err){
			done();
		});
		self = this;
	});

	suite('Create queue message', function(){
		test('A new message should exist in the queue ', function(){			
			assert.ok(self.notification.queue_message_id);
		});
		test('Status should be pending when created', function(){			
			assert.equal('pending', self.notification.status);
		});
	});
});