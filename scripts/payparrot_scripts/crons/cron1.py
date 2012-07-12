# -*- coding: utf-8 -*-

from payparrot_dal import Subscriptions
from payparrot_dal.mongodb import connect
from payparrot_dal.queue import Queue

def main():
    db = connect()
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
        db.subscriptions.update({'_id': subscription_raw['_id']}, {'$set': {'first_tweet': True}})

if __name__ == '__main__':
    main()