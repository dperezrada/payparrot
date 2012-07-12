# -*- coding: utf-8 -*-
import os
import json
import unittest
from datetime import datetime
from bson.objectid import ObjectId
from hashlib import sha256
from random import random

import payparrot_tests as pp_tests
from payparrot_dal import Accounts, AccountsSessions, Messages, Payments

class TestCreateMessages(unittest.TestCase):
    def setUp(self):
        self.app = pp_tests.get_app()
        self.db = pp_tests.connect_to_mongo()
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
        self.account_id = self.response.json.get('id')
        self.app.post('/login',
            {'email': self.account_data['email'], 'password': self.account_data['password']}
        )
        self.messages = [
            {
                'text': 'Este es el mensaje de prueba de dperezrada y gmedel',
                'url' : 'http://www.test.com'
            },
            {
                'text': 'Este es el mensaje de prueba de dperezrada y gmedel 2',
                'url' : 'http://www.test2.com'
            }
        ]
        self.responses = []
        for i, message in enumerate(self.messages):
            self.responses.append(self.app.post_json('/accounts/'+str(self.account_id)+'/messages', message))
    def tearDown(self):
        pp_tests.tear_down(self.db, self.app)
        
    def test_create_status(self):
        self.assertEqual(201, self.responses[0].status_int)
     
    def test_get_object_id(self):
        message_id = self.responses[0].json.get('id')
        self.assertTrue(message_id)
    
    def test_get_message(self):
        message_id = self.responses[0].json.get('id')
        message = self.app.get('/accounts/%s/messages/%s' % (self.account_id, message_id)).json
        self.assertEqual(self.messages[0].get('url'), message.get('url'))
        self.assertEqual(self.messages[0].get('text'), message.get('text'))

    def test_update_message(self):
        message_id = self.responses[0].json.get('id')
        message_to_update = {
            'active': False
        }
        message = self.app.put_json('/accounts/%s/messages/%s' % (str(self.account_id), str(message_id)), message_to_update)
        self.assertEqual(204, message.status_int)

    def test_route_message(self):
        payment_data = {
            'twitter_response': {},
            'action_date': datetime.now(),
            'account_id': ObjectId(),
            'subscription_id': ObjectId(),
            'parrot_id': ObjectId(),
            'message_id': ObjectId(),
            'message_id_sqs': sha256(str(random())).hexdigest(),
            'callback_url': 'http://blabla.com/',
            'success': True
        }
        payment = Payments(self.db, payment_data)
        payment.insert()
        response = self.app.get('/r/%s' % (payment.message_id_sqs))
        self.assertEqual(302,response.status_int)
