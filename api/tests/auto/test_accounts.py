# -*- coding: utf-8 -*-
import os
import json
import unittest

import payparrot_tests as pp_test
from payparrot_dal import Accounts, AccountsSessions

class TestCreateAccounts(unittest.TestCase):
    def setUp(self):
        self.app = pp_test.get_app()
        self.db = pp_test.connect_to_mongo()
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
        self.maxDiff = None
    
    def tearDown(self):
        pp_test.tear_down(self.db, self.app)
        
    def test_create_status(self):
        self.assertEqual(201, self.response.status_int)

    def test_get_object_id(self):
        account_id = self.response.json.get('id')
        self.assertTrue(account_id)
    
    def test_get_saved_account(self):
        account_id = self.response.json.get('id')
        response = self.app.post('/login',
            {'email': self.account_data['email'], 'password': self.account_data['password']}
        )
        expected_json = {
            'id': account_id,
            'email': 'daniel@payparrot.com',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://demo.payparrot.com',
            'notification_url': 'http://demo.payparrot.com/notifications',
            'stats': {
                'parrots_today': 0,
                'parrots_total': 0,
                'payments_today': 0,
                'payments_total': 0
            }
        }
        response = self.app.get('/accounts/'+account_id)
        self.assertEqual(expected_json, response.json)