 var request = require('request'),
	assert = require('assert'),
 	db = require('payparrot_models/libs/mongodb').connect(),
	mongoose = require('mongoose'),
	_ = require('underscore'),
	Notifications = require('payparrot_models/objects/notifications.js'),
	test_utils = require('../utils.js');

describe('GET /accounts/:account_id/notifications/:notification_id/validate', function(){
	var self;
	before(function(done){
		self = this;
		self.account = {
	        'email': 'daniel@payparrot.com',
	        'password': '123',
	        'name': 'Daniel',
	        'startup': 'Payparrot',
	        'url': 'http://payparrot.com/',
		}
		test_utils.create_and_login(self.account, request, done);
	});
	after(function(done){
		require('../../tear_down').remove_all(done);
	});
	it('should return correct notification', function(done){
		self.notification_data = {
			suscription_id: new mongoose.Types.ObjectId(),
			account_id: self.account.id,
			external_id: new mongoose.Types.ObjectId(),
			parrot_id: new mongoose.Types.ObjectId(),
			request_url: 'localhost:3000',
			status: 'pending',
			type: 'suscription_activated'
		};

		self.notification = new Notifications(this.notification_data);
		self.notification.save(function(err){
			request.get({
					url: 'http://localhost:3000/accounts/'+self.account.id+'/credentials'
				}, 
				function (e, r, body){
					self.account.credentials = JSON.parse(body);
					request.get({
							url: 'http://localhost:3000/logout'
						},
						function (e, r, body){
							var url = 'http://localhost:3000/accounts/'+self.account.id+'/notifications/'+self.notification._id+'/validate?token='+self.account.credentials.private_token;
							request.get({
									url: url, followRedirect: false
								}, 
								function (e, r, body){
									var expected = self.notification.returnJSON();
									expected.id = String(self.notification.id);
									expected.suscription_id = String(self.notification.suscription_id);
									expected.account_id = String(self.notification.account_id);
									assert.equal(200, r.statusCode);
									assert.deepEqual(expected, JSON.parse(r.body));
									done();
								}
							);					
						}
					)
				}
			);
		});
	});
});