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
            'stats': {
        		'parrots_total': 0,
        		'parrots_today': 0,
        		'payments_total': 0,
        		'payments_today': 0
            },
        }
        accounts = Accounts.objects(id = account_id)
        self.assertEqual(expected_json, accounts[0].JSON())
        
class TestGetAccountData(unittest.TestCase):
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
            'notification_url': 'http://demo.payparrot.com/notifications',
            'credentials': {
                'public_token': '123',
                'private_token': '456'
            }
        }
        self.response = app.post_json('/accounts', self.account_data)
        self.account_id = self.response.json.get('id')

    def test_get_account_info(self):
        response = app.get('/accounts/'+self.account_id)
        self.assertEqual(200, response.status_int)
        self.assertEqual(
            {
                'id': self.account_id,
                'email': 'daniel@payparrot.com',
                'name': 'Daniel',
                'startup': 'Payparrot',
                'url': 'http://payparrot.com/',
                'callback_url': 'http://demo.payparrot.com',
                'notification_url': 'http://demo.payparrot.com/notifications',
                'stats': {
            		'parrots_total': 0,
            		'parrots_today': 0,
            		'payments_total': 0,
            		'payments_today': 0
                },
            },
            response.json
        )

    def test_get_credentials(self):
        response = app.get('/accounts/'+self.account_id+'/credentials')
        self.assertEqual(200, response.status_int)
        self.assertEqual({'public_token': '123', 'private_token': '456'}, response.json)