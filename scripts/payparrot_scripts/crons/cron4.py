# -*- coding: utf-8 -*-
from datetime import datetime

from payparrot_dal import Subscriptions, NextPayments
from payparrot_dal.mongodb import connect
from payparrot_dal.queue import Queue
from payparrot_scripts.crons.utils import log

def main():
    connection = None
    log('cron4', 'Starting')
    try:
        connection, db = connect()
        next_payments = NextPayments.find(
            db, {'action_date': {'$lte': datetime.now()}}, {'parrot_id':1,'account_id':1,'_id':1}
        ).sort([('_id', -1)])
        
        for next_payment in next_payments:
            subscription = Subscriptions.findOne(db, {'account_id': next_payment.get('account_id'), 'parrot_id': next_payment.get('parrot_id')})
            if subscription and subscription.active:
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
            else:
                db.next_payments.remove({'_id': next_payment.get('_id')})
    finally:
        if connection:
            connection.close()
        log('cron4', 'Finishing')

if __name__ == '__main__':
    main()            