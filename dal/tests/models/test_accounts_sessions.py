# -*- coding: utf-8 -*-
import unittest
import json

from payparrot_dal import Accounts, AccountsSessions

class TestAccountsSessions(unittest.TestCase):
    def setUp(self):
        from mongoengine import connect
        connect('payparrot_test')
        self.account_data = {
            'email': 'daniel@payparrot.com',
            'password': '123',
            'name': 'Daniel',
            'startup': 'Payparrot',
        }
        self.account = Accounts(**self.account_data)
        self.account.save()

        self.account_session = AccountsSessions(account_id = self.account.id)
        self.account_session.save()
    
    def tearDown(self):
        Accounts.drop_collection()
        AccountsSessions.drop_collection()

    def test_create_session_setup_default_elements(self):
        self.assertTrue(self.account_session.expires)
        self.assertTrue(self.account_session.account_id)
        self.assertTrue(self.account_session.id)
        self.assertTrue(self.account_session.session_id)
    
    def test_get_account_from_session(self):
        account = Accounts.get_from_session(id = self.account_session.session_id)
        self.assertEqual(self.account.id, account.id)
        