var request = require('request'),
	assert = require('assert'),
	_ = require('underscore'),
	test_utils = require('../utils.js');

var db = require('payparrot_models/libs/mongodb').connect(),
	Plans = require('payparrot_models/objects/plans');

describe('PUT /accounts/:account_id/plan', function(){
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
		test_utils.create_and_login(self.account, request,
			function(){
				var plan = new Plans({'name': 'social', 'price': 'tweet', 'parrots': 25});
				plan.save(done);
			}
		);
	});
	after(function(done){
		require('../../tear_down').remove_all(done);
	});
	it('should allow you select a new plan', function(done){
		request.put(
			{
				url: 'http://localhost:3000/accounts/'+self.account.id+'/plan',
				json: {
					'name': 'social'
				}
			},
			function (e, response_put, body) {
				assert.equal(200, response_put.statusCode);
				request.get({
						url: 'http://localhost:3000/accounts/'+self.account.id+'/plan'
					},
					function(e, response_get, body){
						assert.equal(200, response_get.statusCode);
						assert.deepEqual({'name': 'social', 'price': 'tweet', 'parrots': '25', 'id': response_put.body.id}, JSON.parse(body));
						done();
				});
			});
	});
	it('should delete your selected plan', function(done){
		request(
			{
				url: 'http://localhost:3000/accounts/'+self.account.id+'/plan',
				method: 'delete'
			},
			function (e, response_put, body) {
				assert.equal(204, response_put.statusCode);
				done();
			});
	});	
});