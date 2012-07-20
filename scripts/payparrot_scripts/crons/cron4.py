# -*- coding: utf-8 -*-
from datetime import datetime

from payparrot_dal import Subscriptions, NextPayments
from payparrot_dal.mongodb import connect
from payparrot_dal.queue import Queue

def main():
    connection = None
    try:
        connection, db = connect()
        next_payments = NextPayments.find(
            db, {'action_date': {'$lte': datetime.now()}}, {'parrot_id':1,'account_id':1,'_id':1}
        ).sort([('_id', -1)])
        
        for next_payment in next_payments:
            subscription = Subscriptions.findOne({'account_id': next_payment.get('account_id'), 'parrot_id': next_payment.get('parrot_id')})
            if subscription:
                created_message = Queue.insert(
                    'payments', 
                    {
                        'subscription_id': str(subscription.id),
                        'account_id': str(subscription.account_id),
                        'parrot_id': str(subscription.parrot_id)
                    }
                )
                if created_message:
                    db.next_payments.remove({'_id': next_payment.get('_id')})
    finally:
        if connection:
            connection.end_request()

if __name__ == '__main__':
    main()            