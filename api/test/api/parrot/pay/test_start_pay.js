var request = require('superagent'),
	assert = require('assert'),
	_ = require('underscore');

describe('GET /parrots/start', function(){
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
		request
			.post('http://localhost:3000/accounts')
			.set('Content-Type', 'application/json')
			.send(self.account)
			.end(function(post_response){
				assert.equal(201, post_response.statusCode);
				self.account.id = post_response.body.id;
				delete self.account.password;
				request.get('http://localhost:3000/accounts/'+self.account.id+'/credentials')
					.end(function(response){
						self.account.credentials = response.body;
						done();
					});
			});
	});
   	it('should be redirected to twitter', function(done){
		request.get('http://localhost:3000/parrots/start?external_id=1&token='+self.account.credentials.public_token)
			.redirects(0)
			.end(function(response){
				assert.equal(302, response.statusCode);
				assert.equal(
					'https://api.twitter.com/oauth/authorize?oauth_token='
					, response.header.location.substring(0, 52)
				);
				done();
			});
	});
	it('should be redirected to twitter', function(done){
		request.get('http://localhost:3000/parrots/start?external_id=1&token=invalid_token')
			.end(function(response){
				assert.equal(404, response.statusCode);
				done();
			});
	});
});