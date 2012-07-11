import os
import json
import unittest
from urlparse import urlparse
from datetime import datetime

import oauth2 as oauth

import payparrot_tests as pp_tests
from payparrot_dal import Accounts, AccountsSessions, Messages, Twitter, Subscriptions, Parrots


class TestFinishPayment(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.app = pp_tests.get_app()
        self.db = pp_tests.connect_to_mongo()
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
        self.redirect = self.app.get('/parrots/start?external_id=1&token=%s' % self.account.credentials['public_token'])
        print "\n", self.redirect.location
        url = raw_input("Final url? ")
        query_string = urlparse(url).query
        self.finish_response = self.app.get('/parrots/finish?%s' % (query_string))

    @classmethod
    def tearDownClass(self):
        pp_tests.tear_down(self.db)

    def test_status_code(self):
        self.assertEqual(302, self.finish_response.status_int)
    
    def test_location(self):
        self.assertEqual('http://www.epistemonikos.org', self.finish_response.location)