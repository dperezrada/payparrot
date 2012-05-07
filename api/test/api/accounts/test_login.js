var request = require('superagent'),
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
		request
			.post('http://localhost:3000/accounts')
			.set('Content-Type', 'application/json')
			.send(self.account)
			.end(function(post_response){
				assert.equal(201, post_response.statusCode);
				self.account.id = post_response.body.id;
				delete self.account.password;
				done();
			});
	});
	after(function(done){
		require('../../tear_down').remove_all(done);
	});
   	it('should be able to login', function(done){
		request
			.post('http://localhost:3000/login')
			.redirects(0)
			.send({
	        	'email': 'daniel@payparrot.com',
	        	'password': '123'})
			.end(function(post_response){
				assert.equal(302, post_response.statusCode);
				assert.equal('http://localhost:3000/logged', post_response.header.location);
				done();
			});
	});
	it('should be able to logout', function(done){
		request
			.post('http://localhost:3000/login')
			.redirects(0)
			.send({
	        	'email': 'daniel@payparrot.com',
	        	'password': '123'})
			.end(function(post_response){
				
				request.get('http://localhost:3000/logout')
					.redirects(0)
					.end(function(response){
						assert.equal(302, response.statusCode);
						
						request.get('http://localhost:3000/logged')
							.redirects(0)
							.end(function(response){
								assert.equal(302, response.statusCode);
								done();
							});
					});
			});
	});
	it('should not be able to login with invalid credentials', function(done){
		request
			.post('http://localhost:3000/login')
			.redirects(0)
			.send({
	        	'email': 'daniel@payparrot.com',
	        	'password': '456'})
			.end(function(post_response){
				assert.equal(302, post_response.statusCode);
				assert.equal('http://localhost:3000/login', post_response.header.location);
				done();
			});
	});
});