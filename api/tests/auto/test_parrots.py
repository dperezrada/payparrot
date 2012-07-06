# -*- coding: utf-8 -*-
import os
import json
import unittest
from urlparse import urlparse
import datetime as datetime2
from datetime import datetime, timedelta, date

import oauth2 as oauth

import payparrot_tests as pp_tests
from payparrot_dal import Accounts, AccountsSessions, Messages, Twitter, Subscriptions, Parrots

class TestParrots(unittest.TestCase):
    def setUp(self):
        self.app = pp_tests.get_app()
        self.db = pp_tests.connect_to_mongo()
        self.account = pp_tests.create_account_and_login(self.app, self.db, {
            'email': 'daniel@payparrot.com',
            'password': '123',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://www.epistemonikos.org',
            'notification_url': 'http://www.epistemonikos.org',
        })
        self.parrot = Parrots(self.db, {
            'twitter_id': '123123123',
            'oauth_token': 'asd',
            'oauth_token_secret': 'asdf',
            'twitter_info': {},
            'payments': []
        })
        self.parrot.insert()
        self.subscription = Subscriptions(self.db, {'account_id': self.account.id, 'active': True, 'parrot_id': self.parrot.id})
        self.subscription.insert()
        
        from ludibrio import Stub
        with Stub() as datetime:
            from datetime import datetime
            datetime.now() >> datetime2.datetime.now() - 2*timedelta(days=1)
            
        self.parrot1 = Parrots(self.db, {
            'twitter_id': '4322143214',
            'oauth_token': 'asd',
            'oauth_token_secret': 'asdf',
            'twitter_info': {},
            'payments': []
        })
        self.parrot1.insert()
        self.subscription1 = Subscriptions(self.db, {'account_id': self.account.id, 'active': True, 'parrot_id': self.parrot1.id})        
        self.subscription1.insert()
        print datetime.now()
        datetime.restore_import()

    def tearDown(self):
        pp_tests.tear_down(self.db, self.app)

    def test_invalid_token(self):
        response = self.app.get('/parrots/finish?oauth_token=lala', status = 404)
        self.assertEqual({'error': 'Expired token'}, response.json)

    def test_get_one_parrot_status(self):
        response = self.app.get('/accounts/%s/parrots/%s' % (self.account.id, self.parrot.id))
        self.assertEqual(200, response.status_int)
        self.assertEqual(self.parrot.JSON(), response.json)

    def test_delete_one_parrot(self):
        response = self.app.delete('/accounts/%s/parrots/%s' % (str(self.account.id), str(self.parrot.id)))
        self.assertEqual(204, response.status_int)
        self.app.get('/accounts/%s/parrots/%s' % (self.account.id, self.parrot.id), status=404)
    
    def test_get_parrots_with_date_filter(self):
        one_day = timedelta(days=1)
        from_ = date.today()-one_day*7
        from_text = str(from_)
        to_ = date.today() - one_day
        to_text = str(to_)
        response = self.app.get('/accounts/%s/parrots?from=%s&to=%s' % (self.account.id, from_text, to_text))
        self.assertEqual(200, response.status_int)
        self.assertEqual(1, len(response.json))
        print response.json
        self.assertEqual(str(self.parrot1.id), response.json[0]['id'])
        
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
