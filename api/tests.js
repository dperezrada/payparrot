var request = require('superagent'),
	assert = require('assert'),
	_ = require('underscore');

describe('Accounts', function(){
	describe('POST /accounts', function(){
		before(function(){
			this.account_data = {
		        'email': 'daniel@payparrot.com',
		        'password': '123',
		        'name': 'Daniel',
		        'startup': 'Payparrot',
		        'url': 'http://payparrot.com/',

			}
		});
    	it('should create a new account when minimal needed parameters are send', function(done){
			var self = this;
      		request
				.post('http://localhost:3000/accounts')
				.set('Content-Type', 'application/json')
				.send(self.account_data)
	 			.end(function(created_account){
					assert.equal(201,created_account.statusCode);
					var id = created_account.body.id;
					request.get('http://localhost:3000/accounts/'+id).end(function(received_account){
						assert.equal(200,received_account.statusCode);
						var expected_body = _.extend({'id': id}, self.account_data);
						delete expected_body.password;
						assert.deepEqual(expected_body, received_account.body);
						done();
					});
	 			});
		});
	});
	describe('POST /accounts/:id/messages', function(){
		before(function(){
			this.account_data = {
		        'email': 'daniel@payparrot.com',
		        'password': '123',
		        'name': 'Daniel',
		        'startup': 'Payparrot',
		        'url': 'http://payparrot.com/',

			}

			this.message_data = {
				'text': 'Este es el mensaje de prueba de dperezrada y gmedel',
				'url' : 'http://www.test.com'
			}
		});
    	it('should create a new message', function(done){
			var self = this;
      		request
				.post('http://localhost:3000/accounts')
				.set('Content-Type', 'application/json')
				.send(self.account_data)
	 			.end(function(created_account){
					assert.equal(201,created_account.statusCode);
					var account_id = created_account.body.id;
					request
						.post('http://localhost:3000/accounts/'+account_id+'/messages')
						.set('Content-Type', 'application/json')
						.send(self.message_data)
			 			.end(function(created_message){
							assert.equal(201,created_message.statusCode);
							var message_id = created_message.body.id;
							request.get('http://localhost:3000/accounts/'+account_id+'/messages/'+message_id).end(function(received_message){
								assert.equal(200,received_message.statusCode);
								var expected_body = _.extend({'id': message_id}, self.message_data);
								assert.deepEqual(expected_body, received_message.body);
								done();
							});
						});
	 			});
		});
	});


});