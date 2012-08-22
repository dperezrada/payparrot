import unittest
from datetime import datetime
from time import sleep
from bson.objectid import ObjectId

import payparrot_tests as pp_tests
from payparrot_dal import Accounts, NextPayments, Subscriptions, Parrots
from payparrot_dal.queue import Queue

class TestCron4(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.connection, self.db = pp_tests.connect_to_mongo()

    @classmethod
    def tearDownClass(self):
        pp_tests.tear_down(self.db, queue = True)
        self.connection.close()

    def test_cron4_no_subscription(self):
        account = Accounts(self.db, {
            'email': 'daniel@payparrot.com',
            'password': '123',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://www.epistemonikos.org',
            'notification_url': 'http://www.epistemonikos.org',
        })
        account.insert()
        parrot = Parrots(self.db, {
            'twitter_id': '123123123',
            'oauth_token': 'asd',
            'oauth_token_secret': 'asdf',
            'twitter_info': {},
            'payments': [],
            'twitter_info': {
                'screen_name': 'danielgua'
            }
        })
        parrot.insert()
        subscription = Subscriptions(self.db, {'account_id': account.id, 'active': False, 'parrot_id': parrot.id, 'twitter_screen_name': parrot.twitter_info.get("screen_name")})
        subscription.insert()

        last_date = datetime.now();
        next_action_date = last_date;
        next_payment = NextPayments(self.db, {
            'account_id': account.id,
            'parrot_id': parrot.id,
            'action_date': next_action_date
        });
        next_payment.insert()


        from payparrot_scripts.crons.cron4 import main as cron4
        cron4()

        message = Queue.get_message('payments')
        self.assertFalse(message)

        self.assertEqual(0, self.db.next_payments.find({'_id': next_payment.id}).count())

