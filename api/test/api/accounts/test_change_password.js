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
	it('should be able to change password', function(done){
		request
			.post('http://localhost:3000/login')
			.redirects(0)
			.send({
	        	'email': 'daniel@payparrot.com',
	        	'password': '123'})
			.end(function(post_response){
				
				request
					.put('http://localhost:3000/accounts/'+self.account.id)
					.redirects(0)
					.set('Content-Type', 'application/json')
					.send({'password': '456'})
					.end(function(post_response){
						
						request.get('http://localhost:3000/logout').end(function(response){
							request
								.post('http://localhost:3000/login')
								.redirects(0)
								.send({
									'email': 'daniel@payparrot.com',
									'password': '456'
								})
								.end(function(post1_response){
									assert.equal(302, post1_response.statusCode);
									assert.equal('http://localhost:3000/logged', post1_response.header.location);
									done();
								});
							
						});
					});
			});
	});
});