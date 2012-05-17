var request = require('request'),
	assert = require('assert'),
	_ = require('underscore'),
	test_utils = require('../../utils.js');

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
	        'callback_url': 'http://www.epistemonikos.org',
		}
		test_utils.create_and_login(self.account, request, done);
	});
	
   	it('should be redirected to twitter', function(done){	
   		request.get({
			url: 'http://localhost:3000/accounts/'+self.account.id+'/credentials'
			}, 
			function (e, r, body){
				assert.equal(200, r.statusCode);
				self.account.credentials = JSON.parse(r.body);
				request.get(
					{
						url: 'http://localhost:3000/parrots/start?external_id=1&token='+self.account.credentials.public_token,
						followRedirect: false
					}, 
					function (e, r, body){
						console.log(r.headers.location);
						assert.equal(302, r.statusCode);
						assert.equal(
							'https://api.twitter.com/oauth/authorize?oauth_token='
							, r.headers.location.substring(0, 52)
						);
						done();
					}
				);
			}
		);
	});
	// it('Should reject invalid tokens', function(done){
	// 		request.get({url: 'http://localhost:3000/parrots/start?external_id=1&token=invalid_token'+self.account.credentials.public_token}, 
	// 				function (e, r, body){
	// 					assert.equal(404, r.statusCode);
	// 					done();
	// 				});
	// 	});
});