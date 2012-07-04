# -*- coding: utf-8 -*-
import os
import json
import unittest
import utils

from server_test_app import app
from payparrot_dal import Accounts, AccountsSessions, Messages

class TestStartPayment(unittest.TestCase):
    def setUp(self):
        self.db = utils.connect_to_mongo()
        self.account = Accounts(self.db, {
            'email': 'daniel@payparrot.com',
            'password': '123',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://www.epistemonikos.org',
        })
        self.account.insert()

        
    def tearDown(self):
        self.db.accounts.drop()
        self.db.messages.drop()
        self.db.accounts_sessions.drop()
        app.get('/logout')

    def test_redirect(self):
        print self.account.credentials













# var request = require('request'),
# 	assert = require('assert'),
# 	_ = require('underscore');

# var db = require('payparrot_models/libs/mongodb').connect();
# 	Notifications = require('payparrot_models/objects/notifications.js'),
# 	test_utils = require('../../../api/utils.js');

# describe('GET /parrots/start', function(){
# 	var self;
# 	before(function(done){
# 		self = this;
# 		self.account = 
# 		test_utils.create_and_login(self.account, request, function(){
# 			request.get({
# 				url: 'http://localhost:3000/accounts/'+self.account.id+'/credentials'
# 				}, 
# 				function (e, r, body){
# 					assert.equal(200, r.statusCode);
# 					self.account.credentials = JSON.parse(r.body);
# 					request.get(
# 						{
# 							url: 'http://localhost:3000/parrots/start?external_id=1&token='+self.account.credentials.public_token,
# 							followRedirect: false
# 						}, 
# 						function (e, r, body){
# 							console.log("TWITTER_URL: "+r.headers.location);
# 							self.response = r;
# 							self.body = body;
# 							done()
# 						}
# 					)
# 				}
# 			)	
# 		});
# 	});
# 	after(function(done){
# 		require('../../../tear_down').remove_all(done);
# 	});
	
#    	it('should be redirected to twitter', function(done){
# 		assert.equal(302, self.response.statusCode);
# 		assert.equal(
# 			'https://api.twitter.com/oauth/authorize?oauth_token='
# 			, self.response.headers.location.substring(0, 52)
# 		);
# 		done();
# 	});
# 	it('should create a notification in the database', function(done){
# 		var prompt = require('prompt');
# 		prompt.start();
# 		prompt.get(['notification_id'], function (err, result) {
# 			Notifications.findOne({'_id': result.notification_id}, function(err, result){
# 				assert.ok(result.queue_message_id);
# 				done();
# 			});
# 		});
# 	});	
# });