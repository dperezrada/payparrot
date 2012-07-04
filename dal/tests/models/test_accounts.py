# -*- coding: utf-8 -*-
import unittest
import json

from payparrot_dal import Accounts
import utils

class TestAccounts(unittest.TestCase):
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
    
    def tearDown(self):
        self.db.accounts.drop()

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

    
    # def test_return_json(self):
    #     account = Accounts(**self.account_data)
    #     expected_json = {
    #         'id': None,
    #         'email': 'daniel@payparrot.com',
    #         'name': 'Daniel',
    #         'startup': 'Payparrot',
    #         'url': 'http://payparrot.com/',
    #         'callback_url': 'http://demo.payparrot.com',
    #         'notification_url': 'http://demo.payparrot.com/notifications',
    #         'stats': {
    # 			'parrots_total': 0,
    # 			'parrots_today': 0,
    # 			'payments_total': 0,
    # 			'payments_today': 0
    # 		}
    #     }
    #     self.assertEqual(expected_json, account.JSON())

    # def test_create_credentials(self):
    #     account = Accounts(**self.account_data)
    #     account.save()
    #     print account.credentials
    #     self.assertTrue(account.credentials.get('private_token'))
    #     self.assertTrue(account.credentials.get('public_token'))

