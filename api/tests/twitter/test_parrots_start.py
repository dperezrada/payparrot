import os
import json
import unittest
from urlparse import urlparse
from datetime import datetime

import oauth2 as oauth

import payparrot_tests as pp_tests
from payparrot_dal import Accounts, AccountsSessions, Messages, Twitter, Subscriptions, Parrots

class TestStartPayment(unittest.TestCase):
    def setUp(self):
        self.app = pp_tests.get_app()
        self.db = pp_tests.connect_to_mongo()
        self.account = Accounts(self.db, {
            'email': 'daniel@payparrot.com',
            'password': '123',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://www.epistemonikos.org',
        })
        self.account.insert()
        self.redirect = self.app.get('/parrots/start?external_id=1&token=%s' % self.account.credentials['public_token'])

        
    def tearDown(self):
        self.db.accounts.drop()
        self.db.messages.drop()
        self.db.accounts_sessions.drop()
        self.app.get('/logout')

    def test_redirect(self):
        self.assertEqual(302, self.redirect.status_int)
        self.assertEqual('https://api.twitter.com/oauth/authorize?oauth_token=', self.redirect.location[0:52])