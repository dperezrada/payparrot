 var request = require('request'),
	assert = require('assert'),
	_ = require('underscore'),
	Suscriptions = require('payparrot_models/objects/suscriptions.js'),
	test_utils = require('../utils.js');

describe('POST /accounts/:account_id/suscriptions', function(){
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
		test_utils.create_and_login(self.account, request, done);
	});
	after(function(done){
		require('../../tear_down').remove_all(done);
	});
	it('should return correct suscription', function(done){
		console.log(self.account);
		self.suscription = {
	        "account_id" : self.account.id, 
	        "parrot_id" : "4fbe4b1e87812bc746000020", 
	        "_id" : "4fbe4b1e87812bc746000021", 
	        "created_at" : "2012-05-24T14:52:14.774Z",
	        "first_tweet" : true, 
	        "notified" : true, 
	        "active" : true,
		}
		var suscription = new Suscriptions(self.suscription);
		suscription.save(function(){
			request.get({
					url: 'http://localhost:3000/accounts/'+self.account.id+'/credentials'
				}, 
				function (e, r, body){
					self.account.credentials = JSON.parse(body);
					console.log(self.account);
					var url='http://localhost:3000/suscriptions/'+suscription._id+'/validate?token='+self.account.credentials.private_token+'&account_id='+self.account.id;
					console.log(url);
					request.get({
							url: 'http://localhost:3000/suscriptions/'+suscription._id+'/validate?token='+self.account.credentials.private_token+'&account_id='+self.account.id
						}, 
						function (e, r, body){
							assert.equal(200, r.statusCode);
							assert.deepEqual(self.suscription, JSON.parse(r.body));
							done();
						}
					);					
				}
			);
		});
	});
});