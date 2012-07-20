# -*- coding: utf-8 -*-
import os
import json
import unittest

import payparrot_tests as pp_test
from payparrot_dal import Accounts, AccountsSessions

class TestToken(unittest.TestCase):
    def setUp(self):
        self.app = pp_test.get_app()
        self.connection, self.db = pp_test.connect_to_mongo()
        self.account_data = {
            'email': 'daniel@payparrot.com',
            'password': '123',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://demo.payparrot.com',
            'notification_url': 'http://demo.payparrot.com/notifications'
        }
        self.response = self.app.post_json('/accounts', self.account_data)
        self.credentials = self.db.accounts.find_one({'email': 'daniel@payparrot.com'}, {'credentials': True})['credentials']
    
    def tearDown(self):
        pp_test.tear_down(self.db, self.app)
        self.connection.close()
      
    def test_get_information_with_token(self):
        response = self.app.get('/accounts/%s?token=%s' % (self.response.json.get('id'), self.credentials.get('private_token')))
        self.assertEqual('daniel@payparrot.com', response.json.get('email'))