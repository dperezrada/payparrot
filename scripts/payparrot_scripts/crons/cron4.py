# -*- coding: utf-8 -*-
from datetime import datetime

from payparrot_dal import Subscriptions, NextPayments
from payparrot_dal.mongodb import connect
from payparrot_dal.queue import Queue

if __name__ == '__main__':
    main()

def main():
    db = connect()
    next_payments = NextPayments.find(
        db, {'action_date': {'$lte': datetime.now()}}, {'parrot_id':1,'account_id':1,'_id':1}
    ).sort([('_id', -1)])
    
    for next_payment in next_payments:
        subscription = Suscriptions.findOne({'account_id': next_payment.get('account_id'), 'parrot_id': next_payment.get('parrot_id')})
        if subscription:
            created_message = Queue.insert(
                'payments', 
                {
                    'suscription_id': str(subscription.id),
                    'account_id': str(subscription.account_id),
                    'parrot_id': str(subscription.parrot_id)
                }
            )
            if created_message:
                db.next_payments.remove({'_id': next_payment.get('_id')})