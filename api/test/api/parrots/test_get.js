
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
	        'email': 'daniel@payparrot.com',
	        'password': '123',
	        'name': 'Daniel',
	        'startup': 'Payparrot',
	        'url': 'http://payparrot.com/',
			'callback_url': 'http://www.epistemonikos.org'
		}
		test_utils.create_and_login(
			self.account,
			request,
			function(){
				self.parrot = new Parrots({ "twitter_info" : {"id" : 572860329 }, "oauth_token_secret" : "mvdm9JQ1kp1cn9SIm5XsaRfxfV6aC1zhKNyJv0t0", "oauth_token" : "572860329-ir0nWSEQx0H7yVbSEIMLpuIuIcYXmQg5f3z7GuQP", "twitter_id" : "572860329", "payments" : [] });
				self.parrot.save(function(){
					var suscription = new Suscriptions({ "account_id" : self.account.id, "parrot_id" : self.parrot._id, "created_at" : Date.now(), "first_tweet" : false, "notified" : false, "active" : true });
					suscription.save(function(){
						done();
					});
				});
			}
		);


	});
	after(function(done){
		require('../../tear_down').remove_all(done);
	});
   	it('should create a new account', function(done){
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

});