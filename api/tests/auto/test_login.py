# -*- coding: utf-8 -*-
import os
import json
import unittest

import payparrot_tests as pp_test
from payparrot_dal import Accounts, AccountsSessions

class TestLoginSimpleUSer(unittest.TestCase):
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
    
    def tearDown(self):
        pp_test.tear_down(self.db, self.app)
      
    def test_cannot_get_logged_page_without_been_logged(self):
        self.response = self.app.get('/logged', status=401)
    
    def test_login_status(self):
        response = self.app.post('/login',
            {'email': self.account_data['email'], 'password': self.account_data['password']}
        )
        self.assertEqual(302, response.status_int)
    
    def test_invalid_login_status(self):
        response = self.app.post_json('/login',
            {'email': self.account_data['email'], 'password': 'INVALID_PASSOWORD'},
            status= 401
        )
    
    def test_login_and_be_able_to_get_logged_page(self):
        response = self.app.post('/login',
            {'email': self.account_data['email'], 'password': self.account_data['password']}
        )
        response = self.app.get('/logged')
        self.assertEqual(302, response.status_int)