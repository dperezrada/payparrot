# -*- coding: utf-8 -*-
import unittest
import json

from payparrot_dal import Accounts
import payparrot_tests as pp_tests

class TestAccounts(unittest.TestCase):
    def setUp(self):
        self.connection, self.db = pp_tests.connect_to_mongo()

        self.account_data = {
            'email': 'daniel@payparrot.com',
            'password': '123',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://demo.payparrot.com',
            'notification_url': 'http://demo.payparrot.com/notifications'
        }
        self.maxDiff = None
    
    def tearDown(self):
        pp_tests.tear_down(self.db)
        self.connection.end_request()

    def test_after_create_instance_you_should_be_able_to_retrieve_data(self):
        account = Accounts(self.db, self.account_data)
        self.assertEqual('daniel@payparrot.com', account.email)
        self.assertEqual('123', account.password)
    
    def test_save_should_generate_an_id(self):
        account = Accounts(self.db, self.account_data)
        account.insert()
        self.assertTrue(account.id)

    def test_update_document(self):
        account = Accounts(self.db, self.account_data)
        account.insert()
        account.update({'name': 'Felipe'})
        self.assertEqual('Felipe', account.name)

    
    def test_return_json(self):
        account = Accounts(self.db, self.account_data)
        account.insert()
        expected_json = {
            'id': str(account.id),
            'email': 'daniel@payparrot.com',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://demo.payparrot.com',
            'notification_url': 'http://demo.payparrot.com/notifications',
            'stats': {}
        }
        received_json = account.JSON()
        self.assertEqual(expected_json, received_json)

    def test_create_credentials(self):
        account = Accounts(self.db, self.account_data)
        account.insert()
        self.assertTrue(account.credentials.get('private_token'))
        self.assertTrue(account.credentials.get('public_token'))

