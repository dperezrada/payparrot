var request = require('superagent'),
	assert = require('assert'),
	_ = require('underscore');

describe('Accounts', function(){
	describe('POST /accounts with minimal needed parameters', function(){
		before(function(){
			this.account_data = {
		        'email': 'daniel@payparrot.com',
		        'name': 'Daniel',
		        'startup': 'Payparrot',
		        'url': 'http://payparrot.com/',
			}
		});
    	it('should create a new account', function(done){
			var self = this;
      		request
				.post('http://localhost:3000/accounts')
				.set('Content-Type', 'application/json')
				.send(self.account_data)
	 			.end(function(res1){
					assert.equal(201,res1.statusCode);
					var id = res1.body.id;
					request.get('http://localhost:3000/accounts/'+id).end(function(res2){
						assert.equal(200,res2.statusCode);
						assert.deepEqual(_.extend(self.account_data, {'id': id}),res2.body);
						done();
					});
	 			});
		})
	})
})