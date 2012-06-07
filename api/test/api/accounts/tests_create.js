var request = require('request'),
	assert = require('assert'),
	_ = require('underscore'),
	test_utils = require('../utils.js');

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
		test_utils.create_and_login(self.account, request, done);
		self.account.stats = {
			parrots_total: 0,
			parrots_today: 0,
			payments_total: 0,
			payments_today: 0
		}
	});
	after(function(done){
		require('../../tear_down').remove_all(done);
	});
   	it('should create a new account', function(done){
		request.get({
						url: 'http://localhost:3000/accounts/'+self.account.id 
					}, 
					function (e, r, body){
						assert.equal(200, r.statusCode);
						assert.deepEqual(self.account, JSON.parse(r.body));
						done();
					}
				);
	});
	it('should generate API credentials', function(done){
		request.get({
						url: 'http://localhost:3000/accounts/'+self.account.id+'/credentials'
					}, 
					function (e, r, body){
						assert.equal(200, r.statusCode);
						var received = JSON.parse(body);
						assert.ok(received.public_token.length >= 40);
						done();
					}
				);
	});
	it('should not create an account because the e-mail is already in use', function(done){
		request.post({url: 'http://localhost:3000/accounts', json: self.account}, function (e, r, body) {
			assert.equal(400, r.statusCode);
			console.log(body);
			done();

		});
	});
});