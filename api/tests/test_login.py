# -*- coding: utf-8 -*-
import os
import json
import unittest

from server_test_app import app
from payparrot_dal import Accounts, AccountsSessions
# class TestLoginSimpleUSer(unittest.TestCase):
#     def setUp(self):
#         from mongoengine import connect
#         connect('payparrot_test')
#         self.account_data = {
#             'email': 'daniel@payparrot.com',
#             'password': '123',
#             'name': 'Daniel',
#             'startup': 'Payparrot',
#             'url': 'http://payparrot.com/',
#             'callback_url': 'http://demo.payparrot.com',
#             'notification_url': 'http://demo.payparrot.com/notifications'
#         }
#         self.response = app.post_json('/accounts', self.account_data)
#     
#     def tearDown(self):
#         Accounts.drop_collection()
#         AccountsSessions.drop_collection()
#       
#     def test_cannot_get_logged_page_without_been_logged(self):
#         self.response = app.get('/logged', status=401)
#     
#     def test_login_status(self):
#         response = app.post_json('/login',
#             {'email': self.account_data['email'], 'password': self.account_data['password']}
#         )
#         self.assertEqual(204, response.status_int)
#     
#     def test_invalid_login_status(self):
#         response = app.post_json('/login',
#             {'email': self.account_data['email'], 'password': 'INVALID_PASSOWORD'},
#             status= 401
#         )
#     
#     def test_login_and_be_able_to_get_logged_page(self):
#         response = app.post_json('/login',
#             {'email': self.account_data['email'], 'password': self.account_data['password']}
#         )
#         response = app.get('/logged')
#         self.assertEqual(200, response.status_int)

class TestLoginAdmin(unittest.TestCase):
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
            'roles': ['admin']
        }
        self.account = Accounts(**self.account_data)
        self.account.save()
    
    def tearDown(self):
        Accounts.drop_collection()
        AccountsSessions.drop_collection()
		
    def test_cannot_get_logged_page_without_been_logged(self):
        response = app.post_json('/login',
            {'email': self.account_data['email'], 'password': self.account_data['password']}
        )
        self.response = app.get('/admin')
        self.assertEqual(200, self.response.status_int)