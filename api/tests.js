var request = require('superagent'),
	assert = require('assert'),
	_ = require('underscore');

describe('Accounts', function(){
	var self;
	before(function(done){
		this.account_data = {
	        'email': 'daniel@payparrot.com',
	        'password': '123',
	        'name': 'Daniel',
	        'startup': 'Payparrot',
	        'url': 'http://payparrot.com/',
		}
		self = this;
		request
			.post('http://localhost:3000/accounts')
			.set('Content-Type', 'application/json')
			.send(self.account_data)
 			.end(function(created_account){
				self.created_account = created_account;
				self.account_data.id = created_account.body.id;
				done();
 			});
	});
	describe('POST /accounts', function(){
    	it('should create a new account when minimal needed parameters are send', function(done){
      		assert.equal(201,self.created_account.statusCode);
			request.get('http://localhost:3000/accounts/'+self.account_data.id).end(function(received_account){
				assert.equal(200,received_account.statusCode);
				var expected_body = _.extend({'id': self.account_data.id}, self.account_data);
				delete expected_body.password;
				assert.deepEqual(expected_body, received_account.body);
				done();
			});
		});
	});
	describe('POST /accounts/:id/messages', function(){
    	it('should create a new message', function(done){
			this.message_data = {
				'text': 'Este es el mensaje de prueba de dperezrada y gmedel',
				'url' : 'http://www.test.com'
			}
			request
				.post('http://localhost:3000/accounts/'+self.account_data.id+'/messages')
				.set('Content-Type', 'application/json')
				.send(self.message_data)
	 			.end(function(created_message){
					assert.equal(201,created_message.statusCode);
					var message_id = created_message.body.id;
					request.get('http://localhost:3000/accounts/'+self.account_data.id+'/messages/'+message_id).end(function(received_message){
						assert.equal(200,received_message.statusCode);
						var expected_body = _.extend({'id': message_id}, self.message_data);
						assert.deepEqual(expected_body, received_message.body);
						done();
					});
				});
		});
	});

});