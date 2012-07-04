# -*- coding: utf-8 -*-
import os
import json
import unittest

import utils
from server_test_app import app
from payparrot_dal import Accounts, AccountsSessions

class TestCreateAccounts(unittest.TestCase):
    def setUp(self):
        self.db = utils.connect_to_mongo()
        self.account_data = {
            'email': 'daniel@payparrot.com',
            'password': '123',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://demo.payparrot.com',
            'notification_url': 'http://demo.payparrot.com/notifications'
        }
        self.response = app.post_json('/accounts', self.account_data)
        self.maxDiff = None
    
    def tearDown(self):
        self.db.accounts.drop()
		
    def test_create_status(self):
        self.assertEqual(201, self.response.status_int)

    def test_get_object_id(self):
        account_id = self.response.json.get('id')
        self.assertTrue(account_id)
    
    def test_get_saved_account(self):
        account_id = self.response.json.get('id')
        expected_json = {
            'id': account_id,
            'email': 'daniel@payparrot.com',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://demo.payparrot.com',
            'notification_url': 'http://demo.payparrot.com/notifications',
            'stats': {},
        }
        response = app.get('/accounts/'+account_id)
        self.assertEqual(expected_json, response.json)