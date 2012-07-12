# -*- coding: utf-8 -*-
import os
import json
import unittest
from urlparse import urlparse
import datetime as datetime2
from datetime import datetime, timedelta, date

import oauth2 as oauth
from ludibrio import Mock

import payparrot_tests as pp_tests
from payparrot_dal.queue import Queue
from payparrot_dal import Accounts, AccountsSessions, Messages, Twitter, Subscriptions, Parrots

class TestCron1(unittest.TestCase):
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
            'payments': [],
            'twitter_info': {
                'screen_name': 'danielgua'
            }
        })
        self.parrot.insert()
        self.subscription = Subscriptions(self.db, {'account_id': self.account.id, 'active': True, 'parrot_id': self.parrot.id, 'twitter_screen_name': self.parrot.twitter_info.get("screen_name")})
        self.subscription.insert()
        
        with Mock() as Queue:
            from payparrot_dal.queue import Queue
            Queue.insert(
                'payments', 
                {
                    'subscription_id': str(self.subscription.id),
                    'account_id': str(self.account.id),
                    'parrot_id': str(self.parrot.id)
                }
            ) 
        
        from payparrot_scripts.crons.cron1 import main as cron1
        cron1()

    def tearDown(self):
        pp_tests.tear_down(self.db, self.app)

    def test_subscription_is_mark_as_first_tweet_true(self):
        self.subscription.refresh()
        self.assertTrue(self.subscription.first_tweet)
    
    def test_queue_method_is_called(self):
        Queue.validate()