# -*- coding: utf-8 -*-
import os
import json
import unittest
import utils

from server_test_app import app
from payparrot_dal import Accounts, AccountsSessions
class TestLoginSimpleUSer(unittest.TestCase):
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
    
    def tearDown(self):
        utils.tear_down(self.db, app)
      
    def test_cannot_get_logged_page_without_been_logged(self):
        self.response = app.get('/logged', status=401)
    
    def test_login_status(self):
        response = app.post_json('/login',
            {'email': self.account_data['email'], 'password': self.account_data['password']}
        )
        self.assertEqual(204, response.status_int)
    
    def test_invalid_login_status(self):
        response = app.post_json('/login',
            {'email': self.account_data['email'], 'password': 'INVALID_PASSOWORD'},
            status= 401
        )
    
    def test_login_and_be_able_to_get_logged_page(self):
        response = app.post_json('/login',
            {'email': self.account_data['email'], 'password': self.account_data['password']}
        )
        response = app.get('/logged')
        self.assertEqual(200, response.status_int)