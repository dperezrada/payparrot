# -*- coding: utf-8 -*-
import os
import json
import unittest
from urlparse import urlparse
import datetime as datetime2
from datetime import datetime, timedelta, date
from bson.objectid import ObjectId

import oauth2 as oauth

import payparrot_tests as pp_tests
from payparrot_dal import Accounts, AccountsSessions, Notifications, Twitter, Subscriptions, Parrots

class TestNotifications(unittest.TestCase):
    def setUp(self):
        self.app = pp_tests.get_app()
        self.db = pp_tests.connect_to_mongo()
        self.account = pp_tests.create_account_and_login(self.app, self.db, {
            'email': 'daniel@payparrot.com',
            'password': '123',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://www.epistemonikos.org',
            'notification_url': 'http://www.epistemonikos.org',
        })
            
        self.notification = Notifications(self.db, {
            'suscription_id': ObjectId(),
            'account_id': self.account.id,
            'external_id': '238462834',
            'parrot_id': ObjectId(),
            'request_url': 'http://localhost:3000/notifications/echo',
            'status': 'pending',
            'type': 'subscription_activated'
        })
        self.notification.insert()

    def tearDown(self):
        pp_tests.tear_down(self.db, self.app)

    def test_get_notification(self):
        # TODO: Secure by private token (api request)
        response = self.app.get('/accounts/%s/notifications/%s' % (self.account.id, self.notification.id))
        expected = self.notification.JSON()
        self.assertEqual(200, response.status_int)
        self.assertEqual(expected, response.json)