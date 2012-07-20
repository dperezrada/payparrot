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
        self.connection, self.db = pp_tests.connect_to_mongo()
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
            'payments': [],
            'twitter_info': {
                'screen_name': 'danielgua'
            }
        })
        self.parrot.insert()
        self.subscription = Subscriptions(self.db, {'account_id': self.account.id, 'active': True, 'parrot_id': self.parrot.id, 'twitter_screen_name': self.parrot.twitter_info.get("screen_name")})
        self.subscription.insert()
            
        self.parrot1 = Parrots(self.db, {
            'twitter_id': '4322143214',
            'oauth_token': 'asd',
            'oauth_token_secret': 'asdf',
            'twitter_info': {},
            'payments': [],
            'twitter_info': {
                'screen_name': 'blabla'
            }
        })
        self.parrot1.insert()
        self.subscription1 = Subscriptions(self.db, {'account_id': self.account.id, 'active': True, 'parrot_id': self.parrot1.id,'twitter_screen_name': self.parrot1.twitter_info.get("screen_name")})        
        self.subscription1.insert()

    def tearDown(self):
        pp_tests.tear_down(self.db, self.app)
        self.connection.close()

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
        from_ = datetime.now()-one_day*7
        from_text = str(from_)
        to_ = datetime.now() - one_day
        to_text = str(to_)
        #Hack to change date
        self.db.subscriptions.update({'parrot_id': self.parrot1.id},{'$set': {'created_at': from_+one_day*5}})
        response = self.app.get('/accounts/%s/parrots?from=%s&to=%s' % (self.account.id, from_text.split(" ")[0], to_text.split(" ")[0]))
        self.assertEqual(200, response.status_int)
        self.assertEqual(1, len(response.json))
        self.assertEqual(str(self.parrot1.id), response.json[0]['id'])

    def test_get_parrots_by_screen_name(self):
        response = self.app.get('/accounts/%s/parrots?screen_name=%s' % (self.account.id, 'danielgua'))
        self.assertEqual(200, response.status_int)
        self.assertEqual(1, len(response.json))
        # self.assertEqual(str(self.parrot1.id), response.json[0]['id'])