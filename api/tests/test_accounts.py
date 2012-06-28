# -*- coding: utf-8 -*-
import os
import json
import unittest

from server_test_app import app
from payparrot_dal import Accounts

class TestCreateAccounts(unittest.TestCase):
    def setUp(self):
        from mongoengine import connect
        connect('payparrot_test')
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
		
    def test_create_status(self):
        self.assertEqual(201, self.response.status_int)

    def test_get_object_id(self):
        account_id = json.loads(self.response.body).get('id')
        self.assertTrue(account_id)
    
    def test_get_saved_account(self):
        account_id = json.loads(self.response.body).get('id')
        expected_json = {
            'id': account_id,
            'email': 'daniel@payparrot.com',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://demo.payparrot.com',
            'notification_url': 'http://demo.payparrot.com/notifications',
            'credentials': {},
            'stats': {},
        }
        accounts = Accounts.objects(id = account_id)
        self.assertEqual(expected_json, json.loads(accounts[0].JSON()))
        
