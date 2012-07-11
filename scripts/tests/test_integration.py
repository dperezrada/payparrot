# -*- coding: utf-8 -*-
import json
import unittest
from urlparse import urlparse
from random import randint

import payparrot_tests as pp_tests
from payparrot_dal import Accounts, Messages, Subscriptions, Parrots, Twitter
from payparrot_dal.queue import Queue


class TestCronsIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.app = pp_tests.get_app()
        self.db = pp_tests.connect_to_mongo()
        self.account = Accounts(self.db, {
            'email': 'daniel@payparrot.com',
            'password': '123',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://www.epistemonikos.org',
            'notification_url': 'http://www.epistemonikos.org',
        })
        self.account.insert()
        
        self.message = Messages(self.db, {
            'account_id': self.account.id,
            'text': 'Hola Mundo %s' % randint(0, 100000),
            'url': 'http://es.wikipedia.org/wiki/Hola_mundo',
            'status': True,
            'active': True
        })
        self.message.insert()
        
        self.redirect = self.app.get('/parrots/start?external_id=1&token=%s' % self.account.credentials['public_token'])
        print "\n", self.redirect.location
        url = raw_input("Final url? ")
        query_string = urlparse(url).query
        self.finish_response = self.app.get('/parrots/finish?%s' % (query_string))

    @classmethod
    def tearDownClass(self):
        pp_tests.tear_down(self.db, queue = True)

    # def test_cron1(self):
    #     from payparrot_scripts.crons.cron1 import main as cron1
    #     cron1()
    #     
    #     subscription = Subscriptions.findOne(self.db, {})
    #     self.assertTrue(subscription.first_tweet)
    #     
    #     self.assertEqual(1, Queue.get_queue('payments').count())
    #     
    #     message = Queue.get_message('payments', visibility_timeout=1)
    #     self.assertEqual({
    #         'subscription_id': str(subscription.id),
    #         'account_id': str(subscription.account_id),
    #         'parrot_id': str(subscription.parrot_id)
    #     }, json.loads(message.get_body()))
    
    def test_crons(self):
        from payparrot_scripts.crons.cron1 import main as cron1
        cron1()
        
        from payparrot_scripts.crons.cron2 import main as cron2
        cron2()
        
        parrot = Parrots.findOne(self.db, {})
        
        twitter = Twitter()
        twitter.create_client(parrot.oauth_token, parrot.oauth_token_secret)
        headers, body = twitter.get("http://api.twitter.com/1/statuses/user_timeline.json?user_id=%s&include_rts=false&count=1" % parrot.twitter_info.get('screen_name'))
        json_twitter_status = json.loads(body)

        message_start = self.message.text
        received_message = json_twitter_status[0].get('text')
        self.assertEqual(self.message.text, received_message[0:len(message_start)])

        queue = Queue.get_queue('payments')
        self.assertEqual(0, queue.count())
        