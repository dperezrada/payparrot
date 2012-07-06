# -*- coding: utf-8 -*-
import os
import json
import unittest
import utils
from urlparse import urlparse

import oauth2 as oauth

from server_test_app import app
from payparrot_dal import Accounts, AccountsSessions, Messages, Twitter, Subscriptions


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
        self.redirect = app.get('/accounts/%s/parrots/start?external_id=1&token=%s' % (self.account.id, self.account.credentials['public_token']))

        
    def tearDown(self):
        utils.tear_down(self.db, app)

    def test_redirect(self):
        self.assertEqual(302, self.redirect.status_int)
        self.assertEqual('https://api.twitter.com/oauth/authorize?oauth_token=', self.redirect.location[0:52])

class TestFinishPayment(unittest.TestCase):
    @classmethod
    def setUpClass(self):
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
        self.redirect = app.get('/accounts/%s/parrots/start?external_id=1&token=%s' % (self.account.id, self.account.credentials['public_token']))
        print ""
        print self.redirect.location
        url = raw_input("Final url? ")
        query_string = urlparse(url).query
        self.finish_response = app.get('/parrots/finish?%s' % (query_string))

    @classmethod
    def tearDownClass(self):
        utils.tear_down(self.db, app)

    def test_status_code(self):
        self.assertEqual(302, self.finish_response.status_int)
    
    # def test_check_subscription(self):
    #     query_string = urlparse(self.finish_response)
    #     self.assertEqual(302, self.finish_response.status_int)

        

    # def test_connection(self):
    #     pass
    #     twitter = Twitter()
    #     client = twitter.create_session()
    #     tokens = twitter.get_request_token(client)
    #     print tokens
    #     url = twitter.redirect_url(tokens)
    #     print url
    #     oauth_verifier = raw_input("Oauth verifier? ")
    #     access_tokens = twitter.get_access_tokens(oauth_verifier,tokens)
    #     print "Access tokens:"
    #     print access_tokens

    #     ## Test api client
    # def test_client(self):
    #     twitter = Twitter()
    #     oauth_token = raw_input("Token? ")
    #     oauth_token_secret = raw_input("Token secret? ")
    #     twitter.create_client(oauth_token,oauth_token_secret)
    #     response = twitter.get('https://api.twitter.com/1/statuses/home_timeline.json')
    #     print response













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