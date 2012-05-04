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
				done();		//To prevent asynchronous when done it's called 'before' will end
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
		before(function(done){
			self.messages_data = [
				{
					'text': 'Este es el mensaje de prueba de dperezrada y gmedel',
					'url' : 'http://www.test.com'
				},
				{
					'text': 'Este es el mensaje de prueba de dperezrada y gmedel 2',
					'url' : 'http://www.test2.com'
				}				
			]
			self.created_messages = []
			
			request
				.post('http://localhost:3000/accounts/'+self.account_data.id+'/messages')
				.set('Content-Type', 'application/json')
				.send(this.messages_data[0])
	 			.end(function(created_message){
					self.created_messages.push(created_message)
					request
						.post('http://localhost:3000/accounts/'+self.account_data.id+'/messages')
						.set('Content-Type', 'application/json')
						.send(self.messages_data[1])
			 			.end(function(created_message){
							self.created_messages.push(created_message)
							done();
						});					
				});				
		});
    	it('should create a new message', function(done){
			assert.equal(201, self.created_messages[0].statusCode);
			var message_id = self.created_messages[0].body.id;
			request.get('http://localhost:3000/accounts/'+self.account_data.id+'/messages/'+message_id)
				.end(function(received_message){
					assert.equal(200,received_message.statusCode);
					var expected_body = _.extend({'id': message_id}, self.messages_data[0]);
					assert.deepEqual(expected_body, received_message.body);
					done();
				});
			
		});
		it('should get the correct message', function(done){
			assert.equal(201, self.created_messages[1].statusCode);
			var message_id = self.created_messages[1].body.id;
			request.get('http://localhost:3000/accounts/'+self.account_data.id+'/messages/'+message_id)
				.end(function(received_message){
					assert.equal(200,received_message.statusCode);
					var expected_body = _.extend({'id': message_id}, self.messages_data[1]);
					assert.deepEqual(expected_body, received_message.body);
					done();
				});
			
		});
	});

});