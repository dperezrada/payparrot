# -*- coding: utf-8 -*-
import unittest
import json

from payparrot_dal import Accounts, Messages
import utils

class TestMessages(unittest.TestCase):
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
        self.message = {
            'text': 'Este es mi primer mensaje',
            'url': 'payparrot.com'
        }
    
    def tearDown(self):
        self.db.accounts.drop()

    def test_after_create_instance_you_should_be_able_to_retrieve_data(self):
        account = Accounts(self.db, self.account_data)
        message = self.message;
        message['account_id'] = account._id;
        new_message = Messages(self.db, message)
        self.assertEqual('Este es mi primer mensaje', new_message.text)
        self.assertEqual('payparrot.com', new_message.url)