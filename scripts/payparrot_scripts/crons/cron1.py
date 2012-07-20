# -*- coding: utf-8 -*-

from payparrot_dal import Subscriptions
from payparrot_dal.mongodb import connect
from payparrot_dal.queue import Queue
from payparrot_scripts.crons.utils import log 

def main():
    connection = None
    try:
        log('cron1', 'Starting')
        connection, db = connect()
        subscriptions = Subscriptions.find(db, {'active': True, 'first_tweet': False})
        for subscription_raw in subscriptions:
            created_message = Queue.insert(
                'payments', 
                {
                    'subscription_id': str(subscription_raw['_id']),
                    'account_id': str(subscription_raw['account_id']),
                    'parrot_id': str(subscription_raw['parrot_id'])
                }
            )
            log('cron1', 'Payment queued %s' % created_message.id, subscription_raw['_id'])
            db.subscriptions.update({'_id': subscription_raw['_id']}, {'$set': {'first_tweet': True}})
            log('cron1', 'Subscription updated', subscription_raw['_id'])
    finally:
        if connection:
            connection.close()


if __name__ == '__main__':
    main()