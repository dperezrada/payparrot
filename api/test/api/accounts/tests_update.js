var request = require('request'),
	assert = require('assert'),
	_ = require('underscore'),
	test_utils = require('../utils.js');

describe('PUT /accounts/:account_id', function(){
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
		self.account_to_modify = {
	        'email': 'daniel@payparroting.com',
	        'name': 'Guillermo',
	        'startup': 'PayparrotIng',
	        'url': 'http://payparroting.com/'
		}
		test_utils.create_and_login(self.account, request, done);
	});
	after(function(done){
		require('../../tear_down').remove_all(done);
	});
	it('should allow to modify the account', function(done){
		request.put(
			{
				url: 'http://localhost:3000/accounts/'+self.account.id,
				json: self.account_to_modify
			},
			function (e, r, body) {
				assert.equal(204, r.statusCode);
				request.get({
						url: 'http://localhost:3000/accounts/'+self.account.id 
					}, 
					function(e, r, body){
						assert.equal(200, r.statusCode);
						var account_saved = JSON.parse(body);
						delete account_saved.id;
						delete account_saved.stats;
						assert.deepEqual(self.account_to_modify, account_saved);
						done();
				});
			});
	});
});