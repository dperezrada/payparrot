var request = require('superagent'),
	assert = require('assert'),
	_ = require('underscore');

describe('POST /accounts', function(){
	var self;
	before(function(done){
		self = this;
		self.account = {
	        'email': 'daniel@payparrot.com',
	        'password': '123',
	        'name': 'Daniel',
	        'startup': 'Payparrot',
	        'url': 'http://payparrot.com/',
			'callback_url': 'http://www.epistemonikos.org'
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
   	it('should create a new account', function(done){
		request.get('http://localhost:3000/accounts/'+self.account.id).end(function(response){
			assert.equal(200, response.statusCode);
			assert.deepEqual(self.account, response.body);
			done();
		});
	});
	it('should generate API credentials', function(done){
		request.get('http://localhost:3000/accounts/'+self.account.id+'/credentials')
			.end(function(response){
				assert.equal(200,response.statusCode);
				assert.ok(response.body.public_token.length >= 40)
				done();
			});
	});
});