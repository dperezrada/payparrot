# # -*- coding: utf-8 -*-
# import os
# import json
# import unittest
# from urlparse import urlparse
# import datetime as datetime2
# from datetime import datetime, timedelta, date

# import oauth2 as oauth
# from ludibrio import Mock

# import payparrot_tests as pp_tests
# from payparrot_dal.queue import Queue
# from payparrot_dal import Accounts, AccountsSessions, Messages, Twitter, Subscriptions, Parrots, Payments

# class TestCron2(unittest.TestCase):
#     def setUp(self):
#         self.app = pp_tests.get_app()
#         self.db = pp_tests.connect_to_mongo()
#         self.account = pp_tests.create_account_and_login(self.app, self.db, {
#             'email': 'daniel@payparrot.com',
#             'password': '123',
#             'name': 'Daniel',
#             'startup': 'Payparrot',
#             'url': 'http://payparrot.com/',
#             'callback_url': 'http://www.epistemonikos.org',
#             'notification_url': 'http://www.epistemonikos.org',
#         })
#         self.parrot = Parrots(self.db, {
#             'twitter_id': '123123123',
#             'oauth_token': 'asd',
#             'oauth_token_secret': 'asdf',
#             'twitter_info': {},
#             'payments': [],
#             'twitter_info': {
#                 'screen_name': 'danielgua'
#             }
#         })
#         self.parrot.insert()
#         self.subscription = Subscriptions(self.db, {'first_tweet': True, 'account_id': self.account.id, 'active': True, 'parrot_id': self.parrot.id, 'twitter_screen_name': self.parrot.twitter_info.get("screen_name")})
#         self.subscription.insert()
        
#         class mockedQueueMessage(object):
#             def __init__(s):
#                 s.id = u'123'
            
#             def get_body(s):
#                 return json.dumps({
#                     'subscription_id': str(self.subscription.id),
#                     'account_id': str(self.account.id),
#                     'parrot_id': str(self.parrot.id)
#                 })

#         with Mock() as Queue:
#             from payparrot_dal.queue import Queue
#             Queue.get_message('payments') >> mockedQueueMessage()
#             Queue.get_message('payments') >> None
        
#         self.message = Messages(self.db, {
#             'account_id': self.account.id,
#             'text': 'Hola Mundo',
#             'url': 'http://www.payparrot.com',
#             'status': True,
#             'active': True
#         })
#         self.message.insert()

#         from payparrot_scripts.crons.cron2 import main as cron2
#         cron2()

#     def tearDown(self):
#         pp_tests.tear_down(self.db, self.app)

#     def test_new_payments_should_exists_on_database(self):
#         self.assertTrue(Payments.findOne(self.db))