# -*- coding: utf-8 -*-
import unittest
import json

from mongoengine import connect

from payparrot_dal import Accounts

class TestAccounts(unittest.TestCase):
    def setUp(self):
        connect('payparrot_test')
        self.account_data = {
            'email': 'daniel@payparrot.com',
            'password': '123',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://www.epistemonikos.org',
            'notification_url': 'http://www.epistemonikos.org/notifications',
            'credentials': {
                'public_token': '123',
                'private_token': '456'
            }
        }
        self.maxDiff = None
    
    def tearDown(self):
        Accounts.drop_collection()

    def test_after_create_instance_you_should_be_able_to_retrieve_data(self):
        account = Accounts(**self.account_data)
        self.assertEqual('daniel@payparrot.com', account.email)
        self.assertEqual('123', account.password)
    
    def test_save_should_generate_an_id(self):
        account = Accounts(**self.account_data)
        account.save()
        self.assertTrue(account.id)
    
    def test_return_json(self):
        account = Accounts(**self.account_data)
        expected_json = {
            'id': None,
            'email': 'daniel@payparrot.com',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://www.epistemonikos.org',
            'notification_url': 'http://www.epistemonikos.org/notifications',
            'credentials': {
                'public_token': '123',
                'private_token': '456'
            },
            'stats': {},
        }
        self.assertEqual(expected_json, json.loads(account.JSON()))
