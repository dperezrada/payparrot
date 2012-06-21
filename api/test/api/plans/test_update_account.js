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
				var plan = new Plans({'name': 'social', 'price': 'tweet'});
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
			function (e, r, body) {
				assert.equal(204, r.statusCode);
				request.get({
						url: 'http://localhost:3000/accounts/'+self.account.id+'/plan'
					},
					function(e, r, body){
						assert.equal(200, r.statusCode);
						assert.deepEqual({'name': 'social', 'price': 'tweet', 'parrots': '25'}, JSON.parse(body));
						done();
				});
			});
	});
});