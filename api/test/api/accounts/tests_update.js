var request = require('superagent'),
	assert = require('assert'),
	_ = require('underscore');

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
		this.account_to_modify = {
	        'email': 'daniel@payparroting.com',
	        'password': '34',
	        'startup': 'PayparrotIng',
	        'url': 'http://payparroting.com/',
		}
		request
			.post('http://localhost:3000/accounts')
			.set('Content-Type', 'application/json')
			.send(self.account)
			.end(function(post_response){
				assert.equal(201, post_response.statusCode);
				self.account.id = post_response.body.id;
								
				request
					.put('http://localhost:3000/accounts/'+self.account.id)
					.set('Content-Type', 'application/json')
					.send(self.account_to_modify)
					.end(function(put_response){
						assert.equal(204, put_response.statusCode);
						self.account = _.extend(self.account, self.account_to_modify);
						delete self.account.password;
						done();
					});
			
			});
	});
	after(function(done){
		require('../../tear_down').remove_all(done);
	});
	it('should allow to modify the account', function(done){
		request.get('http://localhost:3000/accounts/'+self.account.id).end(function(response){
			assert.deepEqual(self.account, response.body);
			done();
		});
	});
});