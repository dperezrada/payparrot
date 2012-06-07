var request = require('request'),
	assert = require('assert'),
	_ = require('underscore'),
	test_utils = require('../utils.js');

describe('POST /login', function(){
	var self;
	before(function(done){
		self = this;
		self.account = {
	        'email': 'daniel@payparrot.com',
	        'password': '123',
	        'name': 'Daniel',
	        'startup': 'Payparrot',
	        'url': 'http://payparrot.com/'
	    }
		test_utils.create_and_login(self.account, request, done);
	});
	after(function(done){
		require('../../tear_down').remove_all(done);
	});
	it('should be able to change password', function(done){
		request.put(
			{
				url: 'http://localhost:3000/accounts/'+self.account.id,
				json: {'password': '456'}
			},
			function (e, r, body) {
				assert.equal(204, r.statusCode);
				request.get({url: 'http://localhost:3000/logout', followRedirect: false}, function(e, r, body){
					assert.equal(302, r.statusCode);
					request.post(
						{
							url: 'http://localhost:3000/login',
							json: {
								'email': 'daniel@payparrot.com',
				       			'password': '456'
							},
							followRedirect: false
						},
						function (e, r, body) {
							assert.equal(302, r.statusCode);
							assert.equal('http://localhost:3000/logged', r.headers.location);
							done();
						}
					);
				});
			}
		);
	});
});