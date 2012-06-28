# -*- coding: utf-8 -*-
import os
import unittest

from server_test_app import app

class TestAccounts(unittest.TestCase):
    def test_create(self):
        account_data = {
	        'email': 'daniel@payparrot.com',
	        'password': '123',
	        'name': 'Daniel',
	        'startup': 'Payparrot',
	        'url': 'http://payparrot.com/',
			'callback_url': 'http://www.epistemonikos.org'
		}

        response = app.post('/accounts', account_data, headers = {'Content-Type': 'aplication/json'})
        print response