
var request = require('request'),
	assert = require('assert'),
	_ = require('underscore'),
	test_utils = require('../utils.js'),
	db = require('payparrot_models/libs/mongodb').connect();

var Suscriptions = require('payparrot_models/objects/suscriptions');
var Parrots = require('payparrot_models/objects/parrots');

describe('POST /accounts/:id/parrots', function(){
	var self;
	before(function(done){
		self = this;
		self.account = {
	        'email': 'daniel1@payparrot.com',
	        'password': '123',
	        'name': 'Daniel',
	        'startup': 'Payparrot',
	        'url': 'http://payparrot.com/',
			'callback_url': 'http://www.epistemonikos.org'
		}
		self.account2 = {};
		_.extend(self.account2, self.account);
		self.account2.email = 'daniel2@payparrot.com';
		test_utils.create_and_login(
			self.account2,
			request,
			function(){
				test_utils.create_and_login(
				self.account,
				request,
				function(){
					self.parrot = new Parrots({ "twitter_info" : {"id" : 572860329 }, "oauth_token_secret" : "mvdm9JQ1kp1cn9SIm5XsaRfxfV6aC1zhKNyJv0t0", "oauth_token" : "572860329-ir0nWSEQx0H7yVbSEIMLpuIuIcYXmQg5f3z7GuQP", "twitter_id" : "572860329", "payments" : [
						{
							account_id: self.account2.id,
							text: 'hola',
							created_at: new Date()
						},
						{
							account_id: self.account.id,
							text: 'chao',
							created_at: new Date()
						}
					] });
					self.parrot.save(function(){
						var suscription = new Suscriptions({ "account_id" : self.account.id, "parrot_id" : self.parrot._id, "created_at" : Date.now(), "first_tweet" : false, "notified" : false, "active" : true });
						suscription.save(function(){
							self.suscription = suscription;
							done();
						});
					});
				});
			}
		);
	});
	after(function(done){
		require('../../tear_down').remove_all(done);
		//done();
	});
   	it('should get parrots from account', function(done){
   		var today = new Date();
   		var today_text = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
   		var tomorrow= new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
   		var tomorrow_text = tomorrow.getFullYear()+"-"+(tomorrow.getMonth()+1)+"-"+tomorrow.getDate();
		request.get({
						url: 'http://localhost:3000/accounts/'+self.account.id+'/parrots/?suscription_start='+today_text+'&suscription_end='+tomorrow_text 
					}, 
					function (e, r, body){
						assert.equal(200, r.statusCode);
						assert.ok(JSON.parse(body).length >=1);
						done();
					}
				);
	});
   	it('should return payments from one account', function(done){
   		var today = new Date();
   		var today_text = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
   		var tomorrow= new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
   		var tomorrow_text = tomorrow.getFullYear()+"-"+(tomorrow.getMonth()+1)+"-"+tomorrow.getDate();
		request.get({
						url: 'http://localhost:3000/accounts/'+self.account.id+'/parrots/?suscription_start='+today_text+'&suscription_end='+tomorrow_text 
					}, 
					function (e, r, body){
						assert.equal(200, r.statusCode);
						assert.equal(1,JSON.parse(body)[0].payments.length);
						done();
					}
				);
	});
   	it('should return one parrot', function(done){
		request.get({
						url: 'http://localhost:3000/accounts/'+self.account.id+'/parrots/'+self.parrot._id
					}, 
					function (e, r, body){
						assert.equal(200, r.statusCode);
						//assert.deepEqual(self.suscription,JSON.parse(body));
						done();
					}
				);
	});

   	it('should delete one parrot', function(done){
		request({
						url: 'http://localhost:3000/accounts/'+self.account.id+'/parrots/'+self.parrot._id,
						method: 'DELETE'
					}, 
					function (e, r, body){
						assert.equal(204, r.statusCode);
						//assert.deepEqual(self.suscription,JSON.parse(body));
						request.get({
										url: 'http://localhost:3000/accounts/'+self.account.id+'/parrots/'+self.parrot._id
									}, 
									function (e, r, body){
										assert.equal(404, r.statusCode);
										//assert.deepEqual(self.suscription,JSON.parse(body));
										done();
									}
								);
					}
				);

	});	


});