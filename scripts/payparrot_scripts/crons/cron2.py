# -*- coding: utf-8 -*-
import sys
import json
from random import randint
from bson.objectid import ObjectId
from datetime import datetime
from dateutil.relativedelta import relativedelta

from payparrot_dal.mongodb import connect
from payparrot_dal.queue import Queue
from payparrot_dal import Accounts, Notifications, Parrots, Messages, Twitter, Payments, Subscriptions, NextPayments


if __name__ == '__main__':
    main()

def main():
    db = connect('payparrot_test')
    message = Queue.get_message('payment_test')
    while message:
        process_payment(db, message)
        message = Queue.get_message('payment_test')

def process_payment(db, raw_message):
    payment_message = json.loads(raw_message.get_body())
    parrot = Parrots.findOne(db, {'_id': ObjectId(payment_message.get('parrot_id'))})
    if parrot:
        message = get_message_to_share(db, payment_message)
        twitter_json = tweet_message(parrot, message)
        payment = store_payment(db, twitter_json, payment_message, message, raw_message)
        if payment.success:
            if Queue.delete_message('payment_test', raw_message):
                print "Payments succeded"
                send_notification(db, payment, 'payment_success')
                create_next_payment(db, payment)
                add_payment_to_parrot(db, parrot, payment_message, twitter_json)
            else:
                print >> sys.stderr, "Failed. Problem with delete message"
        else:
            print >> sys.stderr, "Failed. Problem with twitter", twitter_json
            total_payments_attempts = Payments.find(db, {'message_id_sqs': raw_message.id}).count()
            subscription = Subscriptions.findOne(db, {'account_id': payment.account_id, 'parrot_id': payment.parrot_id})
            if subscription:
                if total_payments_attempts > 3:
                    print >> sys.stderr, "Too many payments attempts"
                    subscription.update({'active': False})
                    if Queue.delete_message('payment_test', message_raw):
                        send_notification(payment,'subscription_deactivated')
                    else:
                        print >> sys.stderr, "Failed. Couldnt delete message."
                else:
                    print "Attempt", total_payments_attempts

def create_trackable_url(message_id):
  return 'http://pprt.co/r/%s' % message_id

def get_message_to_share(db, payment_message):
    # TODO: Resolver pregunta. Que significa status?
    messages = list(Messages.find(db, {'account_id': ObjectId(payment_message.get('account_id')), 'status': True, 'active': True}))
    total_messages = len(messages)
    if total_messages == 0:
        print >> sys.stderr, "No active or validated messages available"
        return
    return messages[randint(0, total_messages-1)]

def tweet_message(parrot, message):
    twitter = Twitter()
    twitter.create_client(parrot.oauth_token, parrot.oauth_token_secret)
    trackable_url = create_trackable_url(message.get('id'))
    headers, body = twitter.post("https://api.twitter.com/1/statuses/update.json", {"status": message.get('text')+" "+trackable_url})
    return json.loads(body)

def store_payment(db, twitter_json, payment_message, message, raw_message):
    payment_data = {
        'twitter_response': twitter_json,
        # TODO: Entender este action data
        'action_date': datetime.now(),
        'account_id': ObjectId(payment_message.get('account_id')),
        'parrot_id': ObjectId(payment_message.get('parrot_id')),
        'message_id': ObjectId(message.get('id')),
        'message_id_sqs': raw_message.id,
        'callback_url': message.get('url', ''),
        'success': True
    }
    if twitter_json.get('error'):
        payment_data['success'] = False
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
    print "Sending notification"
    subscription = Subscriptions.findOne(db, {'account_id': payment.account_id, 'parrot_id': payment.parrot_id})
    if subscription:
        account = Accounts.findOne(db, payment.account_id)
        print account.notification_url
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