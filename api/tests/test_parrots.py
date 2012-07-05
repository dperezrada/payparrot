# -*- coding: utf-8 -*-
import os
import json
import unittest
from urlparse import urlparse
from datetime import datetime

import oauth2 as oauth

import utils
from server_test_app import app
from payparrot_dal import Accounts, AccountsSessions, Messages, Twitter, Subscriptions, Parrots


# class TestStartPayment(unittest.TestCase):
#     def setUp(self):
#         self.db = utils.connect_to_mongo()
#         self.account = Accounts(self.db, {
#             'email': 'daniel@payparrot.com',
#             'password': '123',
#             'name': 'Daniel',
#             'startup': 'Payparrot',
#             'url': 'http://payparrot.com/',
#             'callback_url': 'http://www.epistemonikos.org',
#         })
#         self.account.insert()
#         self.redirect = app.get('/accounts/%s/parrots/start?external_id=1&token=%s' % (self.account.id, self.account.credentials['public_token']))

        
#     def tearDown(self):
#         self.db.accounts.drop()
#         self.db.messages.drop()
#         self.db.accounts_sessions.drop()
#         app.get('/logout')

#     def test_redirect(self):
#         self.assertEqual(302, self.redirect.status_int)
#         self.assertEqual('https://api.twitter.com/oauth/authorize?oauth_token=', self.redirect.location[0:52])

# class TestFinishPayment(unittest.TestCase):
#     @classmethod
#     def setUpClass(self):
#         self.db = utils.connect_to_mongo()
#         self.account = Accounts(self.db, {
#             'email': 'daniel@payparrot.com',
#             'password': '123',
#             'name': 'Daniel',
#             'startup': 'Payparrot',
#             'url': 'http://payparrot.com/',
#             'callback_url': 'http://www.epistemonikos.org',
#             'notification_url': 'http://www.epistemonikos.org',
#         })
#         self.account.insert()
#         self.redirect = app.get('/accounts/%s/parrots/start?external_id=1&token=%s' % (self.account.id, self.account.credentials['public_token']))
#         print "\n", self.redirect.location
#         url = raw_input("Final url? ")
#         query_string = urlparse(url).query
#         self.finish_response = app.get('/parrots/finish?%s' % (query_string))

#     @classmethod
#     def tearDownClass(self):
#         self.db.accounts.drop()
#         self.db.messages.drop()
#         self.db.accounts_sessions.drop()
#         app.get('/logout')

#     def test_status_code(self):
#         self.assertEqual(302, self.finish_response.status_int)
    
#     def test_location(self):
#         self.assertEqual('http://www.epistemonikos.org', self.finish_response.location)

class TestParrots(unittest.TestCase):
    def setUp(self):
        self.db = utils.connect_to_mongo()
        self.account = Accounts(self.db, {
            'email': 'daniel@payparrot.com',
            'password': '123',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://www.epistemonikos.org',
            'notification_url': 'http://www.epistemonikos.org',
        })
        self.account.insert()
        self.parrot = Parrots(self.db, {
            'twitter_id': '123123123',
            'oauth_token': 'asd',
            'oauth_token_secret': 'asdf',
            'created_at': datetime.now(),
            'twitter_info': {},
            'payments': []
        })
        self.parrot.insert()
        self.subscription = Subscriptions(self.db, {'account_id': self.account.id, 'active': True, 'parrot_id': self.parrot.id})
        self.subscription.insert()

    def tearDown(self):
        utils.tear_down(self.db)

    def test_invalid_token(self):
        response = app.get('/parrots/finish?oauth_token=lala', status = 404)
        self.assertEqual({'error': 'Expired token'}, response.json)

    def test_get_one_parrot_status(self):
        response = app.get('/accounts/%s/parrots/%s' % (self.account.id, self.parrot.id))
        self.assertEqual(200, response.status_int)
        self.assertEqual(self.parrot.JSON(), response.json)

    def test_delete_one_parrot(self):
        response = app.delete('/accounts/%s/parrots/%s' % (str(self.account.id), str(self.parrot.id)))
        self.assertEqual(204, response.status_int)
        app.get('/accounts/%s/parrots/%s' % (self.account.id, self.parrot.id), status=404)
    
    def test_location(self):
        pass



    # it('should get parrots from account', function(done){
    #     var today = new Date();
    #     var today_text = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
    #     var tomorrow= new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
    #     var tomorrow_text = tomorrow.getFullYear()+"-"+(tomorrow.getMonth()+1)+"-"+tomorrow.getDate();
    #     request.get({
    #                     url: 'http://localhost:3000/accounts/'+self.account2.id+'/parrots/?from='+today_text+'&to='+tomorrow_text 
    #                 }, 
    #                 function (e, r, body){
    #                     assert.equal(200, r.statusCode);
    #                     assert.ok(JSON.parse(body).length >=1);
    #                     done();
    #                 }
    #             );
    # });
    # it('should return payments from one account', function(done){
    #     var today = new Date();
    #     var today_text = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
    #     var tomorrow= new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
    #     var tomorrow_text = tomorrow.getFullYear()+"-"+(tomorrow.getMonth()+1)+"-"+tomorrow.getDate();
    #     request.get({
    #                     url: 'http://localhost:3000/accounts/'+self.account2.id+'/parrots/?from='+today_text+'&to='+tomorrow_text 
    #                 }, 
    #                 function (e, r, body){
    #                     assert.equal(200, r.statusCode);
    #                     assert.equal(1,JSON.parse(body)[0].payments.length);
    #                     done();
    #                 }
    #             );
    # });

    # it('should delete one parrot', function(done){
    #     request({
    #                     url: 'http://localhost:3000/accounts/'+self.account2.id+'/parrots/'+self.parrot._id,
    #                     method: 'DELETE'
    #                 }, 
    #                 function (e, r, body){
    #                     assert.equal(204, r.statusCode);
    #                     //assert.deepEqual(self.suscription,JSON.parse(body));
    #                     request.get({
    #                                     url: 'http://localhost:3000/accounts/'+self.account2.id+'/parrots/'+self.parrot._id
    #                                 }, 
    #                                 function (e, r, body){
    #                                     assert.equal(404, r.statusCode);
    #                                     //assert.deepEqual(self.suscription,JSON.parse(body));
    #                                     done();
    #                                 }
    #                             );
    #                 }
    #             );

    # }); 



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

