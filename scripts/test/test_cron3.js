var mongoose = require('mongoose'),
	db = require('payparrot_models/libs/mongodb').connect(),
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
			request_url: 'http://localhost:3000/notifications/echo',
			status: 'pending',
			type: 'suscription_activated'
		};

		this.notification = new Notification(this.notification_data);
		this.notification.save(function(err){
			done();
		});
		self = this;
	});
	
	teardown(function(done){
		require('../../api/test/tear_down').remove_all(done);
	});

	suite('Check post notification', function(){
		test('response_headers should be object not a string', function(done){
			var cron3 = require('../crons/cron3').main;
			cron3(function(){
				Notification.findOne({_id: self.notification._id}, {}, function(err, notification){
					assert.equal(typeof({}), typeof(notification.response_headers));
					done();					
				});
			});
		});
	});
});