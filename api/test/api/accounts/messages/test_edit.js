var request = require('request'),
	assert = require('assert'),
	_ = require('underscore');

describe('POST /accounts/:id/messages', function(){
	var self;
	before(function(done){
		self = this;
		self.account = {
	        'email': 'daniel@payparrots.com',
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
		request.post({url: 'http://localhost:3000/accounts', json: self.account}, function (e, r, body) {
			assert.equal(201, r.statusCode);
			self.account.id = r.body.id;
			delete self.account.password;
			request.post(
				{
					url: 'http://localhost:3000/login',
					json: {
						'email': 'daniel@payparrots.com',
		       			'password': '123'
					},
					followRedirect: false
				},
				function (e, r, body) {
					assert.equal(302, r.statusCode);
					assert.equal('http://localhost:3000/logged', r.headers.location);
					request.post(
						{
							url: 'http://localhost:3000/accounts/'+self.account.id+'/messages',
							json: self.messages[0]
						},
						function (e, r, body) {
							assert.equal(201, r.statusCode);
							self.messages[0].id = r.body.id;
							self.messages[0].status = 0;
							self.messages[0].active = 1;
							request.post(
							{
								url: 'http://localhost:3000/accounts/'+self.account.id+'/messages',
								json: self.messages[1]
							},
							function (e, r, body) {
								assert.equal(201, r.statusCode);
								self.messages[1].id = r.body.id;
								self.messages[1].status = 0;
								self.messages[1].active = 1;
								done();
							});
						}
					);
				}
			);
		});
	});
	after(function(done){
		require('../../../tear_down').remove_all(done);
	});
	it('should edit a message', function(done){
		request.put(
			{
				url: 'http://localhost:3000/accounts/'+self.account.id+'/messages/'+self.messages[0].id, 
					json: self.messages[0]
			}, 
			function (e, r, body) {
				assert.equal(204,r.statusCode);
				done();
			}
		);
	});
	it('should get the edited message', function(done){
		request.get({
						url: 'http://localhost:3000/accounts/'+self.account.id+'/messages/'+self.messages[0].id
					}, 
					function (e, r, body){
						assert.equal(200,r.statusCode);
						assert.deepEqual(self.messages[0], JSON.parse(r.body));
						done();
					}
				);		
	});
});