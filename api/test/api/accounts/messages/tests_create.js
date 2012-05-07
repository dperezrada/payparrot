var request = require('superagent'),
	assert = require('assert'),
	_ = require('underscore');

describe('POST /accounts/:id/messages', function(){
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
		self.messages = [
			{
				'text': 'Este es el mensaje de prueba de dperezrada y gmedel',
				'url' : 'http://www.test.com'
			},
			{
				'text': 'Este es el mensaje de prueba de dperezrada y gmedel 2',
				'url' : 'http://www.test2.com'
			}				
		]
		request
			.post('http://localhost:3000/accounts')
			.set('Content-Type', 'application/json')
			.send(self.account)
			.end(function(post_response){
				assert.equal(201, post_response.statusCode);
				self.account.id = post_response.body.id;
				request
					.post('http://localhost:3000/accounts/'+self.account.id+'/messages')
					.set('Content-Type', 'application/json')
					.send(self.messages[0])
		 			.end(function(message1_response){
						assert.equal(201, message1_response.statusCode);
						self.messages[0].id = message1_response.body.id;
						request
							.post('http://localhost:3000/accounts/'+self.account.id+'/messages')
							.set('Content-Type', 'application/json')
							.send(self.messages[1])
				 			.end(function(message2_response){
								assert.equal(201, message2_response.statusCode);
								self.messages[1].id = message2_response.body.id;
								done();
							});					
					});
			});
	});
	after(function(done){
		require('../../../tear_down').remove_all(done);
	});
	it('should create a new message', function(done){
		request.get('http://localhost:3000/accounts/'+self.account_id+'/messages/'+self.messages[0].id)
			.end(function(response){
				assert.equal(200,response.statusCode);
				assert.deepEqual(self.messages[0], response.body);
				done();
			});
	});
	it('should get the correct message', function(done){
		request.get('http://localhost:3000/accounts/'+self.account_id+'/messages/'+self.messages[1].id)
			.end(function(response){
				assert.equal(200,response.statusCode);
				assert.deepEqual(self.messages[1], response.body);
				done();
			});
	});
});