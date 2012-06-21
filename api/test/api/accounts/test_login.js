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
   	it('should be able to login', function(done){
		request.get({url: 'http://localhost:3000/logged', followRedirect: false}, function(e, r, body){
			assert.equal(302, r.statusCode);
			assert.equal('http://localhost:3000/accounts/setup', r.headers.location);
			done();
		});
	});
	it('should be able to logout', function(done){
		request.get({url: 'http://localhost:3000/logout', followRedirect: false}, function(e, r, body){
			assert.equal(302, r.statusCode);
			assert.equal('http://localhost:3000/', r.headers.location);
			request.get({url: 'http://localhost:3000/logged', followRedirect: false}, function(e, r, body){
				assert.equal(302, r.statusCode);
				done();
			});
		});
	});
	it('should not be able to login with invalid credentials', function(done){
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
				assert.equal('http://localhost:3000/login', r.headers.location);
				done();
			}
		);
	});
});