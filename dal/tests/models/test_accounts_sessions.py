# -*- coding: utf-8 -*-
import unittest
import json
from hashlib import sha1

import payparrot_tests as pp_tests
from payparrot_dal import Accounts, AccountsSessions

class TestAccountsSessions(unittest.TestCase):
    def setUp(self):
        self.connection, self.db = pp_tests.connect_to_mongo()

        self.account_data = {
            'email': 'daniel@payparrot.com',
            'password': '123',
            'name': 'Daniel',
            'startup': 'Payparrot',
        }
        self.account = Accounts(self.db, self.account_data)
        self.account.insert()
        
        self.account_session = AccountsSessions(self.db, {'account_id':self.account.id})
        self.account_session.insert()

    
    def tearDown(self):
        pp_tests.tear_down(self.db)
        self.connection.close()

    def test_create_session_setup_default_elements(self):
        self.assertTrue(self.account_session.expires)
        self.assertTrue(self.account_session.account_id)
        self.assertTrue(self.account_session.id)
        self.assertTrue(self.account_session.session_id)
    
    def test_get_account_from_session(self):
        account = Accounts.get_from_session(self.db, id = self.account_session.session_id)
        self.assertEqual(self.account.id, account.id)

class TestAccountsDefaults(unittest.TestCase):
    def setUp(self):
        self.connection, self.db = pp_tests.connect_to_mongo()
    
    def tearDown(self):
        pp_tests.tear_down(self.db)
        self.connection.close()

    def test_distinct_session_id(self):
        account_session1 = AccountsSessions(self.db, {})
        account_session2 = AccountsSessions(self.db, {})
        self.assertNotEqual(account_session1.session_id, account_session2.session_id)
