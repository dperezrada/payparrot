# -*- coding: utf-8 -*-
import sys
import json
from random import randint
from bson.objectid import ObjectId
from datetime import datetime
from dateutil.relativedelta import relativedelta
from payparrot_scripts.crons.utils import log 

from payparrot_dal.mongodb import connect
from payparrot_dal.queue import Queue
from payparrot_dal import Accounts, Notifications, Parrots, Messages, Twitter, Payments, Subscriptions, NextPayments

def main():
    log('cron2', 'Starting')
    db = connect()
    message = Queue.get_message('payments')
    while message:
        payment_message = json.loads(message.get_body())
        log('cron2', 'Got payment %s' % message.id, payment_message.get('subscription_id')) 
        process_payment(db, message, payment_message)
        message = Queue.get_message('payments')

def process_payment(db, raw_message, payment_message):
    parrot = Parrots.findOne(db, {'_id': ObjectId(payment_message.get('parrot_id'))})
    if parrot:
        message = get_message_to_share(db, payment_message)
        twitter_json = tweet_message(parrot, message, raw_message.id)
        payment = store_payment(db, twitter_json, payment_message, message, raw_message)
        if payment.success:
            if Queue.delete_message('payments', raw_message):
                log('cron2', 'Payments succeded', payment_message.get('subscription_id'))
                send_notification(db, payment, 'payment_success')
                log('cron2', 'Notification sent', payment_message.get('subscription_id'))
                create_next_payment(db, payment)
                log('cron2', 'Next payment created', payment_message.get('subscription_id'))
                add_payment_to_parrot(db, parrot, payment_message, twitter_json)
            else:
                log('cron2', 'ERROR: Couldnt delete message', payment_message.get('subscription_id'))
        else:
            log('cron2', 'ERROR: Problem with twitter %s' % json.dumps(twitter_json), payment_message.get('subscription_id'))
            total_payments_attempts = Payments.find(db, {'message_id_sqs': raw_message.id}).count()
            subscription = Subscriptions.findOne(db, {'account_id': payment.account_id, 'parrot_id': payment.parrot_id})
            if subscription:
                if total_payments_attempts > 3:
                    log('cron2', 'Too many payments attempts', payment_message.get('subscription_id'))
                    subscription.update({'active': False})
                    if Queue.delete_message('payments', message_raw):
                        send_notification(payment,'subscription_deactivated')
                    else:
                        log('cron2', 'ERROR: Couldnt delete message', payment_message.get('subscription_id'))
                else:
                    log('cron2', 'Attempt %s' % total_payments_attempts, payment_message.get('subscription_id'))

def create_trackable_url(message_id):
  return 'http://pprt.co/r/%s' % message_id

def get_message_to_share(db, payment_message):
    # status means if we approved or not the message. Default True
    messages = list(Messages.find(db, {'account_id': ObjectId(payment_message.get('account_id')), 'status': True, 'active': True}))
    total_messages = len(messages)
    if total_messages == 0:
        log('cron2', 'WARNING: No active or validated messages available', payment_message.get('subscription_id'))
        return
    return messages[randint(0, total_messages-1)]

def tweet_message(parrot, message, id_sqs):
    twitter = Twitter()
    twitter.create_client(parrot.oauth_token, parrot.oauth_token_secret)
    trackable_url = create_trackable_url(id_sqs)
    headers, body = twitter.post("https://api.twitter.com/1/statuses/update.json", {"status": message.get('text')+" "+trackable_url})
    return json.loads(body)

def store_payment(db, twitter_json, payment_message, message, raw_message):
    subscription = Subscriptions.findOne(db, {'account_id': ObjectId(payment_message.get('account_id')),'parrot_id': ObjectId(payment_message.get('parrot_id'))})
    payment_data = {
        'twitter_response': twitter_json,
        # action date means when this payment has to be tweeted
        'action_date': datetime.now(),
        'account_id': ObjectId(payment_message.get('account_id')),
        'subscription_id': ObjectId(subscription.id),
        'parrot_id': ObjectId(payment_message.get('parrot_id')),
        'message_id': ObjectId(message.get('id')),
        'message_id_sqs': raw_message.id,
        'callback_url': message.get('url', ''),
        'success': True
    }
    if twitter_json.get('error'):
        payment_data['success'] = False
        log('cron2', 'ERROR: Payment coulndt be processed because of twitter error' % json.dumps(twitter_json), payment_message.get('subscription_id'))
    log('cron2', 'Payment executed successfully', payment_message.get('subscription_id'))
    payment = Payments(db, payment_data)
    payment.insert()
    return payment

def add_payment_to_parrot(db, parrot, payment_message, twitter_json):
    db.parrots.update(
        {'_id': parrot.id}, 
        {'$push': {'payments': 
            {
                'account_id': payment_message.get('account_id'),
                'text': twitter_json.get('text')
                # TODO: ADD DATE
                # 'created_at': new Date(payment.twitter_response.created_at),
            }
        }}
    )


def send_notification(db, payment, notification_type):
    subscription = Subscriptions.findOne(db, {'account_id': payment.account_id, 'parrot_id': payment.parrot_id})
    if subscription:
        account = Accounts.findOne(db, payment.account_id)
        if account:
          notification = Notifications(db, {
              'account_id': payment.account_id, 
              'parrot_id': payment.parrot_id, 
              'type': notification_type,
              'subscription_id': subscription.id,
              'external_id': subscription.external_id,
              'request_url': account.notification_url
          })
          notification.insert()

def create_next_payment(db, last_payment):
    last_date = last_payment.created_at;
    next_action_date = last_date + relativedelta( months = +1 )
    next_payment = NextPayments(db, {
        'account_id': last_payment.account_id,
        'parrot_id': last_payment.parrot_id,
        'action_date': next_action_date
    });
    next_payment.insert()

if __name__ == '__main__':
    main()    