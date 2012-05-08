var request = require('request'),
	assert = require('assert'),
	_ = require('underscore');

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
		request.post({url: 'http://localhost:3000/accounts', json: self.account}, function (e, r, body) {
			assert.equal(201, r.statusCode);
			self.account.id = r.body.id;
			delete self.account.password;
			request.post(
				{
					url: 'http://localhost:3000/login',
					json: {
						'email': 'daniel@payparrot.com',
		       			'password': '123'
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
	});
	after(function(done){
		require('../../tear_down').remove_all(done);
	});
   	it('should be able to login', function(done){
		request.get({url: 'http://localhost:3000/logged', followRedirect: false}, function(e, r, body){
			assert.equal(200, r.statusCode);
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